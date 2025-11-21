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
    private Long restaurantId;
    private List<OrderItemResponse> items;
    private Double totalPrice;
    private OrderStatus status;
    private LocalDateTime createdAt;
}

