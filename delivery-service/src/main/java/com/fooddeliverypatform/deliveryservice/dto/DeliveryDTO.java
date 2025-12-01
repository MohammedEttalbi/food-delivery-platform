package com.fooddeliverypatform.deliveryservice.dto;

import com.fooddeliverypatform.deliveryservice.model.DeliveryStatus;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryDTO {
    private Long id;
    private Long orderId;
    private Long driverId;
    private String driverName;
    private String restaurantAddress;
    private String customerAddress;
    private Double distanceKm;
    private Integer estimatedTimeMinutes;
    private DeliveryStatus status;
    private LocalDateTime assignedAt;
    private LocalDateTime pickedUpAt;
    private LocalDateTime deliveredAt;
    private String trackingUrl;
    private String notes;
}