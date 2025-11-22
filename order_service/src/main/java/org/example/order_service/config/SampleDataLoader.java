package org.example.order_service.config;

import lombok.RequiredArgsConstructor;
import org.example.order_service.model.Order;
import org.example.order_service.model.OrderStatus;
import org.example.order_service.repository.OrderRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Arrays;

/**
 * Seeds the database with a few sample orders to make manual testing easier.
 * This loader is idempotent (runs only when there are no existing orders).
 */
@Component
@RequiredArgsConstructor
public class SampleDataLoader implements CommandLineRunner {

    private final OrderRepository orderRepository;

    @Override
    public void run(String... args) {
        // Seed only once
        if (orderRepository.count() > 0) {
            return;
        }

        // Order 1 for customer 101 at restaurant 1
        Order order1 = new Order();
        order1.setCustomerId(101L);
        order1.setRestaurantId(1L);
        order1.setStatus(OrderStatus.PENDING);
        order1.setCreatedAt(LocalDateTime.now().minusHours(3));

        // Order 2 for customer 202 at restaurant 2
        Order order2 = new Order();
        order2.setCustomerId(202L);
        order2.setRestaurantId(2L);
        order2.setStatus(OrderStatus.CONFIRMED);
        order2.setCreatedAt(LocalDateTime.now().minusHours(2));

        // Order 3 for customer 101 at restaurant 2 (delivered)
        Order order3 = new Order();
        order3.setCustomerId(101L);
        order3.setRestaurantId(2L);
        order3.setStatus(OrderStatus.DELIVERED);
        order3.setCreatedAt(LocalDateTime.now().minusHours(1));

        // Persist orders
        orderRepository.saveAll(Arrays.asList(order1, order2, order3));
    }
}
