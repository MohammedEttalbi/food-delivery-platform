package org.example.order_service.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.example.order_service.model.OrderStatus;

@Getter
@Setter
@NoArgsConstructor
public class UpdateOrderStatusRequest {

    @NotNull
    private OrderStatus status;
}
