package org.example.order_service.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.order_service.dto.CreateOrderRequest;
import org.example.order_service.dto.OrderResponse;
import org.example.order_service.dto.UpdateOrderStatusRequest;
import org.example.order_service.model.OrderStatus;
import org.example.order_service.service.OrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;


    // Create an order

    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@Valid @RequestBody CreateOrderRequest request) {

        OrderResponse response = orderService.createOrder(request);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }


    // Get order by id

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable Long id) {

        return ResponseEntity.ok(orderService.getOrderById(id));
    }


    // List orders for a customer via query parameter

    @GetMapping
    public ResponseEntity<List<OrderResponse>> getOrdersForCustomer(@RequestParam(required = false) Long customerId) {

        if (customerId == null) {

            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(orderService.getOrdersForCustomer(customerId));
    }


    // List orders for a restaurant

    @GetMapping("/by-restaurant/{restaurantId}")
    public ResponseEntity<List<OrderResponse>> getOrdersByRestaurant(@PathVariable Long restaurantId) {

        return ResponseEntity.ok(orderService.getOrdersByRestaurant(restaurantId));
    }


    // Update order status

    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(@PathVariable Long id,
                                                           @Valid @RequestBody UpdateOrderStatusRequest body) {
        OrderStatus status = body.getStatus();

        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }
}

