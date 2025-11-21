package org.example.order_service.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
public class CreateOrderRequest {

    private Long customerId;
    private Long restaurantId;
}

