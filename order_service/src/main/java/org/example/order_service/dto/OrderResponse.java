package org.example.order_service.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.order_service.model.OrderStatus;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OrderResponse {

    private Long id;
    private Long customerId;
    // Expose full Restaurant details fetched from restaurant_service
    private Restaurant restaurant;
    private OrderStatus status;
    private Double totalAmount;
    private String deliveryAddress;
    private LocalDateTime createdAt;
}
