package com.fooddeliverypatform.deliveryservice.controller;


import com.fooddeliverypatform.deliveryservice.dto.DeliveryDTO;
import com.fooddeliverypatform.deliveryservice.dto.DeliveryRequestDTO;
import com.fooddeliverypatform.deliveryservice.model.DeliveryStatus;
import com.fooddeliverypatform.deliveryservice.service.DeliveryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/deliveries")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DeliveryController {

    private final DeliveryService deliveryService;

    @PostMapping
    public ResponseEntity<DeliveryDTO> createDelivery(@Valid @RequestBody DeliveryRequestDTO request) {
        DeliveryDTO delivery = deliveryService.createDelivery(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(delivery);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DeliveryDTO> getDeliveryById(@PathVariable Long id) {
        DeliveryDTO delivery = deliveryService.getDeliveryById(id);
        return ResponseEntity.ok(delivery);
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<DeliveryDTO> getDeliveryByOrderId(@PathVariable Long orderId) {
        DeliveryDTO delivery = deliveryService.getDeliveryByOrderId(orderId);
        return ResponseEntity.ok(delivery);
    }

    @GetMapping("/driver/{driverId}")
    public ResponseEntity<List<DeliveryDTO>> getDeliveriesByDriver(@PathVariable Long driverId) {
        List<DeliveryDTO> deliveries = deliveryService.getDeliveriesByDriverId(driverId);
        return ResponseEntity.ok(deliveries);
    }

    @GetMapping("/driver/{driverId}/active")
    public ResponseEntity<List<DeliveryDTO>> getActiveDeliveriesByDriver(@PathVariable Long driverId) {
        List<DeliveryDTO> deliveries = deliveryService.getActiveDeliveriesByDriver(driverId);
        return ResponseEntity.ok(deliveries);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<DeliveryDTO>> getDeliveriesByStatus(@PathVariable DeliveryStatus status) {
        List<DeliveryDTO> deliveries = deliveryService.getDeliveriesByStatus(status);
        return ResponseEntity.ok(deliveries);
    }

    @GetMapping
    public ResponseEntity<List<DeliveryDTO>> getAllDeliveries() {
        List<DeliveryDTO> deliveries = deliveryService.getAllDeliveries();
        return ResponseEntity.ok(deliveries);
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<DeliveryDTO> assignDriver(
            @PathVariable Long id,
            @RequestParam Long driverId,
            @RequestParam String driverName) {
        DeliveryDTO delivery = deliveryService.assignDriver(id, driverId, driverName);
        return ResponseEntity.ok(delivery);
    }

    @PutMapping("/{id}/pickup")
    public ResponseEntity<DeliveryDTO> markAsPickedUp(@PathVariable Long id) {
        DeliveryDTO delivery = deliveryService.markAsPickedUp(id);
        return ResponseEntity.ok(delivery);
    }

    @PutMapping("/{id}/transit")
    public ResponseEntity<DeliveryDTO> markAsInTransit(@PathVariable Long id) {
        DeliveryDTO delivery = deliveryService.markAsInTransit(id);
        return ResponseEntity.ok(delivery);
    }

    @PutMapping("/{id}/delivered")
    public ResponseEntity<DeliveryDTO> markAsDelivered(@PathVariable Long id) {
        DeliveryDTO delivery = deliveryService.markAsDelivered(id);
        return ResponseEntity.ok(delivery);
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<DeliveryDTO> cancelDelivery(
            @PathVariable Long id,
            @RequestParam(required = false, defaultValue = "No reason provided") String reason) {
        DeliveryDTO delivery = deliveryService.cancelDelivery(id, reason);
        return ResponseEntity.ok(delivery);
    }
}
