package org.example.order_service.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class CreateOrderRequest {

    @NotNull
    private Long customerId;

    @NotNull
    @Valid
    private Restaurant restaurant;

    private Double totalAmount;

    private String deliveryAddress;
}
