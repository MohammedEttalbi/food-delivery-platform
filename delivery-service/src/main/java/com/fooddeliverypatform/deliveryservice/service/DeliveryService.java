package com.fooddeliverypatform.deliveryservice.service;




import com.fooddeliverypatform.deliveryservice.dto.DeliveryDTO;
import com.fooddeliverypatform.deliveryservice.dto.DeliveryRequestDTO;
import com.fooddeliverypatform.deliveryservice.exception.DeliveryAlreadyExistsException;
import com.fooddeliverypatform.deliveryservice.exception.DeliveryNotFoundException;
import com.fooddeliverypatform.deliveryservice.model.Delivery;
import com.fooddeliverypatform.deliveryservice.model.DeliveryStatus;
import com.fooddeliverypatform.deliveryservice.repository.DeliveryRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class DeliveryService {

    private final DeliveryRepository deliveryRepository;
    private final OpenRouteService openRouteService;

    /**
     * Crée une nouvelle livraison avec calcul automatique de distance via OpenRouteService
     */
    public DeliveryDTO createDelivery(DeliveryRequestDTO request) {
        log.info("Creating delivery for order: {}", request.getOrderId());

        // Vérifier si la livraison existe déjà
        if (deliveryRepository.existsByOrderId(request.getOrderId())) {
            throw new DeliveryAlreadyExistsException("Delivery already exists for order: " + request.getOrderId());
        }

        Delivery delivery = new Delivery();
        delivery.setOrderId(request.getOrderId());
        delivery.setDriverId(request.getDriverId());
        delivery.setRestaurantAddress(request.getRestaurantAddress());
        delivery.setCustomerAddress(request.getCustomerAddress());
        delivery.setNotes(request.getNotes());
        delivery.setStatus(DeliveryStatus.PENDING);

        // Géocodage des adresses et calcul de distance avec OpenRouteService
        try {
            // Obtenir les coordonnées des adresses
            OpenRouteService.Coordinates restaurantCoords = openRouteService.geocodeAddress(request.getRestaurantAddress());
            OpenRouteService.Coordinates customerCoords = openRouteService.geocodeAddress(request.getCustomerAddress());

            if (restaurantCoords != null && customerCoords != null) {
                delivery.setRestaurantLatitude(restaurantCoords.getLatitude());
                delivery.setRestaurantLongitude(restaurantCoords.getLongitude());
                delivery.setCustomerLatitude(customerCoords.getLatitude());
                delivery.setCustomerLongitude(customerCoords.getLongitude());

                // Calcul de distance et temps
                OpenRouteService.DistanceResult distanceResult = openRouteService.calculateDistance(
                        restaurantCoords,
                        customerCoords
                );

                if (distanceResult != null) {
                    delivery.setDistanceKm(distanceResult.getDistanceKm());
                    delivery.setEstimatedTimeMinutes(distanceResult.getTimeMinutes());

                    // Générer URL de suivi
                    String trackingUrl = openRouteService.getTrackingUrl(
                            restaurantCoords,
                            customerCoords
                    );
                    delivery.setTrackingUrl(trackingUrl);

                    log.info("Distance calculated: {}km, Estimated time: {}min",
                            String.format("%.2f", distanceResult.getDistanceKm()),
                            distanceResult.getTimeMinutes());
                }
            } else {
                log.warn("Could not geocode one or both addresses");
            }
        } catch (Exception e) {
            log.error("Error calculating distance with OpenRouteService: {}", e.getMessage());
            // Continue sans les données de distance
        }

        Delivery savedDelivery = deliveryRepository.save(delivery);
        log.info("Delivery created successfully with ID: {}", savedDelivery.getId());

        return mapToDTO(savedDelivery);
    }

    /**
     * Assigne un livreur à une livraison
     */
    public DeliveryDTO assignDriver(Long deliveryId, Long driverId, String driverName) {
        Delivery delivery = getDeliveryEntity(deliveryId);

        delivery.setDriverId(driverId);
        delivery.setDriverName(driverName);
        delivery.setStatus(DeliveryStatus.ASSIGNED);
        delivery.setAssignedAt(LocalDateTime.now());

        log.info("Driver {} assigned to delivery {}", driverName, deliveryId);
        return mapToDTO(deliveryRepository.save(delivery));
    }

    /**
     * Marque la commande comme récupérée au restaurant
     */
    public DeliveryDTO markAsPickedUp(Long deliveryId) {
        Delivery delivery = getDeliveryEntity(deliveryId);

        delivery.setStatus(DeliveryStatus.PICKED_UP);
        delivery.setPickedUpAt(LocalDateTime.now());

        log.info("Delivery {} marked as picked up", deliveryId);
        return mapToDTO(deliveryRepository.save(delivery));
    }

    /**
     * Marque la livraison comme en transit
     */
    public DeliveryDTO markAsInTransit(Long deliveryId) {
        Delivery delivery = getDeliveryEntity(deliveryId);
        delivery.setStatus(DeliveryStatus.IN_TRANSIT);

        log.info("Delivery {} is now in transit", deliveryId);
        return mapToDTO(deliveryRepository.save(delivery));
    }

    /**
     * Marque la livraison comme terminée
     */
    public DeliveryDTO markAsDelivered(Long deliveryId) {
        Delivery delivery = getDeliveryEntity(deliveryId);

        delivery.setStatus(DeliveryStatus.DELIVERED);
        delivery.setDeliveredAt(LocalDateTime.now());

        log.info("Delivery {} marked as delivered", deliveryId);
        return mapToDTO(deliveryRepository.save(delivery));
    }

    /**
     * Annule une livraison
     */
    public DeliveryDTO cancelDelivery(Long deliveryId, String reason) {
        Delivery delivery = getDeliveryEntity(deliveryId);

        delivery.setStatus(DeliveryStatus.CANCELLED);
        delivery.setNotes(delivery.getNotes() + " | Cancelled: " + reason);

        log.info("Delivery {} cancelled: {}", deliveryId, reason);
        return mapToDTO(deliveryRepository.save(delivery));
    }

    /**
     * Récupère une livraison par ID
     */
    @Transactional(readOnly = true)
    public DeliveryDTO getDeliveryById(Long id) {
        return mapToDTO(getDeliveryEntity(id));
    }

    /**
     * Récupère une livraison par ID de commande
     */
    @Transactional(readOnly = true)
    public DeliveryDTO getDeliveryByOrderId(Long orderId) {
        Delivery delivery = deliveryRepository.findByOrderId(orderId)
                .orElseThrow(() -> new DeliveryNotFoundException("Delivery not found for order: " + orderId));
        return mapToDTO(delivery);
    }

    /**
     * Récupère toutes les livraisons d'un livreur
     */
    @Transactional(readOnly = true)
    public List<DeliveryDTO> getDeliveriesByDriverId(Long driverId) {
        return deliveryRepository.findByDriverId(driverId)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Récupère toutes les livraisons par statut
     */
    @Transactional(readOnly = true)
    public List<DeliveryDTO> getDeliveriesByStatus(DeliveryStatus status) {
        return deliveryRepository.findByStatus(status)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Récupère toutes les livraisons actives d'un livreur
     */
    @Transactional(readOnly = true)
    public List<DeliveryDTO> getActiveDeliveriesByDriver(Long driverId) {
        return deliveryRepository.findByDriverIdAndStatus(driverId, DeliveryStatus.IN_TRANSIT)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Récupère toutes les livraisons
     */
    @Transactional(readOnly = true)
    public List<DeliveryDTO> getAllDeliveries() {
        return deliveryRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Helper methods

    private Delivery getDeliveryEntity(Long id) {
        return deliveryRepository.findById(id)
                .orElseThrow(() -> new DeliveryNotFoundException("Delivery not found with id: " + id));
    }

    private DeliveryDTO mapToDTO(Delivery delivery) {
        DeliveryDTO dto = new DeliveryDTO();
        dto.setId(delivery.getId());
        dto.setOrderId(delivery.getOrderId());
        dto.setDriverId(delivery.getDriverId());
        dto.setDriverName(delivery.getDriverName());
        dto.setRestaurantAddress(delivery.getRestaurantAddress());
        dto.setCustomerAddress(delivery.getCustomerAddress());
        dto.setDistanceKm(delivery.getDistanceKm());
        dto.setEstimatedTimeMinutes(delivery.getEstimatedTimeMinutes());
        dto.setStatus(delivery.getStatus());
        dto.setAssignedAt(delivery.getAssignedAt());
        dto.setPickedUpAt(delivery.getPickedUpAt());
        dto.setDeliveredAt(delivery.getDeliveredAt());
        dto.setTrackingUrl(delivery.getTrackingUrl());
        dto.setNotes(delivery.getNotes());
        return dto;
    }
}
