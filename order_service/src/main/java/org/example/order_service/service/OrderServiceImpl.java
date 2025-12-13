package org.example.order_service.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.order_service.dto.CreateOrderRequest;
import org.example.order_service.dto.OrderResponse;
import org.example.order_service.dto.Restaurant;
import org.example.order_service.client.RestaurantServiceClient;
import org.example.order_service.mapper.OrderMapper;
import org.example.order_service.model.Order;
import org.example.order_service.model.OrderStatus;
import org.example.order_service.repository.OrderRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final OrderMapper orderMapper;
    private final RestaurantServiceClient restaurantClient;

    @Override
    public OrderResponse createOrder(CreateOrderRequest request) {

        Order order = new Order();

        order.setCustomerId(request.getCustomerId());
        if (request.getRestaurant() == null || request.getRestaurant().getId() == null) {
            throw new RuntimeException("Restaurant must be provided with a valid id");
        }
        // Validate restaurant existence via restaurant-service before creating the
        // order
        Long restaurantId = request.getRestaurant().getId();
        try {
            // If the restaurant doesn't exist, the client should throw an error (e.g., 404)
            restaurantClient.getRestaurantById(restaurantId);
        } catch (Exception e) {
            throw new RuntimeException("Restaurant not found");
        }
        // persist only the restaurant id
        order.setRestaurantId(restaurantId);
        order.setStatus(OrderStatus.PENDING);
        order.setTotalAmount(request.getTotalAmount());
        order.setDeliveryAddress(request.getDeliveryAddress());
        order.setCreatedAt(LocalDateTime.now());

        order = orderRepository.save(order);

        OrderResponse response = orderMapper.toResponse(order);
        response.setRestaurant(fetchRestaurant(order.getRestaurantId()));
        return response;
    }

    @Override
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus status) {

        Order order = getOrder(orderId);
        order.setStatus(status);

        Order saved = orderRepository.save(order);
        OrderResponse response = orderMapper.toResponse(saved);
        response.setRestaurant(fetchRestaurant(saved.getRestaurantId()));
        return response;
    }

    @Override
    public OrderResponse getOrderById(Long id) {

        Order order = getOrder(id);
        OrderResponse response = orderMapper.toResponse(order);
        response.setRestaurant(fetchRestaurant(order.getRestaurantId()));
        return response;
    }

    @Override
    public List<OrderResponse> getOrdersForCustomer(Long customerId) {

        List<Order> orders = orderRepository.findByCustomerId(customerId);
        List<OrderResponse> responses = orderMapper.toResponseList(orders);
        // attach restaurant details
        for (int i = 0; i < orders.size(); i++) {
            responses.get(i).setRestaurant(fetchRestaurant(orders.get(i).getRestaurantId()));
        }
        return responses;
    }

    @Override
    public List<OrderResponse> getOrdersByRestaurant(Long restaurantId) {

        List<Order> orders = orderRepository.findByRestaurantId(restaurantId);
        List<OrderResponse> responses = orderMapper.toResponseList(orders);
        for (int i = 0; i < orders.size(); i++) {
            responses.get(i).setRestaurant(fetchRestaurant(orders.get(i).getRestaurantId()));
        }
        return responses;
    }

    private Order getOrder(Long id) {

        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    private Restaurant fetchRestaurant(Long restaurantId) {
        try {
            return restaurantClient.getRestaurantById(restaurantId);
        } catch (Exception e) {
            // degrade gracefully if restaurant service is unavailable
            Restaurant fallback = new Restaurant();
            fallback.setId(restaurantId);
            fallback.setName("Unknown");
            fallback.setAddress(null);
            return fallback;
        }
    }
}
