package org.example.order_service.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// This is no longer a JPA entity in order-service.
// Menu items live in restaurant-service; this class is retained only if needed as a simple DTO.
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class MenuItem {
    private Long id;
    private Long restaurantId;
    private String name;
    private Double price;
}
