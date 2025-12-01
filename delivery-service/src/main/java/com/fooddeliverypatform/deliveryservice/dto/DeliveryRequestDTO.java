package com.fooddeliverypatform.deliveryservice.dto;



import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryRequestDTO {

    @NotNull(message = "Order ID is required")
    private Long orderId;

    @NotNull(message = "Driver ID is required")
    private Long driverId;

    @NotBlank(message = "Restaurant address is required")
    private String restaurantAddress;

    @NotBlank(message = "Customer address is required")
    private String customerAddress;

    private String notes;

}