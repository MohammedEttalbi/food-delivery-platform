package org.example.order_service.client;

import org.example.order_service.dto.Restaurant;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * OpenFeign client for interacting with the Restaurant service (port 8085 by default).
 */
@FeignClient(name = "restaurant-service", url = "${restaurant.service.url:http://localhost:8085}")
public interface RestaurantServiceClient {

    @GetMapping("/api/restaurants/{id}")
    Restaurant getRestaurantById(@PathVariable("id") Long id);
}
