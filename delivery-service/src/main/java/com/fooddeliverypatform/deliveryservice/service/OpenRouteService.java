package com.fooddeliverypatform.deliveryservice.service;



import com.fooddeliverypatform.deliveryservice.dto.OpenRouteDirectionsResponse;
import com.fooddeliverypatform.deliveryservice.dto.OpenRouteGeocodingResponse;
import com.fooddeliverypatform.deliveryservice.dto.OpenRouteMatrixResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class OpenRouteService {

    private final WebClient webClient;
    private final String apiKey;

    public OpenRouteService(WebClient.Builder webClientBuilder,
                            @Value("${openroute.api.key}") String apiKey) {
        this.webClient = webClientBuilder
                .baseUrl("https://api.openrouteservice.org")
                .build();
        this.apiKey = apiKey;
    }

    /**
     * Géocode une adresse pour obtenir ses coordonnées (longitude, latitude)
     */
    public Coordinates geocodeAddress(String address) {
        log.info("Geocoding address: {}", address);

        try {
            OpenRouteGeocodingResponse response = webClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/geocode/search")
                            .queryParam("api_key", apiKey)
                            .queryParam("text", address)
                            .queryParam("size", 1)
                            .build())
                    .retrieve()
                    .bodyToMono(OpenRouteGeocodingResponse.class)
                    .block();

            if (response != null &&
                    response.getFeatures() != null &&
                    !response.getFeatures().isEmpty()) {

                List<Double> coords = response.getFeatures().get(0)
                        .getGeometry().getCoordinates();

                log.info("Geocoding successful for: {}", address);
                return new Coordinates(coords.get(1), coords.get(0)); // lat, lng
            }

            log.warn("No coordinates found for address: {}", address);
            return null;

        } catch (Exception e) {
            log.error("Error geocoding address: {}", e.getMessage(), e);
            throw new RuntimeException("Geocoding failed: " + e.getMessage());
        }
    }

    /**
     * Calcule la distance et le temps entre deux coordonnées
     */
    public DistanceResult calculateDistance(Coordinates origin, Coordinates destination) {
        log.info("Calculating distance from {} to {}", origin, destination);

        try {
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("locations", List.of(
                    List.of(origin.getLongitude(), origin.getLatitude()),
                    List.of(destination.getLongitude(), destination.getLatitude())
            ));
            requestBody.put("metrics", List.of("distance", "duration"));

            log.debug("Request body: {}", requestBody);

            OpenRouteMatrixResponse response = webClient.post()
                    .uri(uriBuilder -> uriBuilder
                            .path("/v2/matrix/driving-car")
                            .queryParam("api_key", apiKey)
                            .build())
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(OpenRouteMatrixResponse.class)
                    .doOnSuccess(r -> log.debug("Response received: distances={}, durations={}",
                            r != null ? r.getDistances() : null,
                            r != null ? r.getDurations() : null))
                    .block();

            if (response != null &&
                    response.getDistances() != null &&
                    !response.getDistances().isEmpty() &&
                    response.getDurations() != null &&
                    !response.getDurations().isEmpty()) {

                // La matrice retourne distances[source][destination]
                // Pour 2 points, on a une matrice 2x2, on veut distances[0][1]
                Double distanceMeters = response.getDistances().get(0).get(1);
                Double durationSeconds = response.getDurations().get(0).get(1);

                Double distanceKm = distanceMeters / 1000.0;
                Integer timeMinutes = (int) Math.ceil(durationSeconds / 60.0);

                log.info("Distance calculation successful: {}km, {}min",
                        String.format("%.2f", distanceKm), timeMinutes);

                return new DistanceResult(distanceKm, timeMinutes);
            }

            log.warn("No distance data returned");
            return null;

        } catch (Exception e) {
            log.error("Error calculating distance: {}", e.getMessage(), e);
            // Log more details for debugging
            if (e.getCause() != null) {
                log.error("Cause: {}", e.getCause().getMessage());
            }
            throw new RuntimeException("Distance calculation failed: " + e.getMessage());
        }
    }

    /**
     * Obtient l'itinéraire complet avec les instructions
     */
    public OpenRouteDirectionsResponse getDirections(Coordinates origin, Coordinates destination) {
        log.info("Getting directions from {} to {}", origin, destination);

        try {
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("coordinates", List.of(
                    List.of(origin.getLongitude(), origin.getLatitude()),
                    List.of(destination.getLongitude(), destination.getLatitude())
            ));

            OpenRouteDirectionsResponse response = webClient.post()
                    .uri(uriBuilder -> uriBuilder
                            .path("/v2/directions/driving-car")
                            .queryParam("api_key", apiKey)
                            .build())
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(OpenRouteDirectionsResponse.class)
                    .block();

            log.info("Directions retrieved successfully");
            return response;

        } catch (Exception e) {
            log.error("Error getting directions: {}", e.getMessage(), e);
            throw new RuntimeException("Directions retrieval failed: " + e.getMessage());
        }
    }

    /**
     * Génère une URL Google Maps pour le suivi
     * (Google Maps pour l'affichage, OpenRoute pour les calculs)
     */
    public String getTrackingUrl(Coordinates origin, Coordinates destination) {
        return String.format(
                "https://www.google.com/maps/dir/?api=1&origin=%f,%f&destination=%f,%f&travelmode=driving",
                origin.getLatitude(), origin.getLongitude(),
                destination.getLatitude(), destination.getLongitude()
        );
    }

    /**
     * Génère une URL OpenRouteService pour visualiser l'itinéraire
     */
    public String getOpenRouteTrackingUrl(Coordinates origin, Coordinates destination) {
        return String.format(
                "https://maps.openrouteservice.org/directions?n1=%f&n2=%f&n3=18&a=%f,%f,%f,%f&b=0&c=0&k1=en-US&k2=km",
                origin.getLatitude(), origin.getLongitude(),
                origin.getLongitude(), origin.getLatitude(),
                destination.getLongitude(), destination.getLatitude()
        );
    }

    // Classes internes pour structurer les résultats

    @lombok.Data
    @lombok.AllArgsConstructor
    @lombok.NoArgsConstructor
    public static class Coordinates {
        private Double latitude;
        private Double longitude;
    }

    @lombok.Data
    @lombok.AllArgsConstructor
    @lombok.NoArgsConstructor
    public static class DistanceResult {
        private Double distanceKm;
        private Integer timeMinutes;
    }
}