package org.example.order_service.service;

import org.example.order_service.model.OrderStatus;
import org.example.order_service.dto.AddItemRequest;
import org.example.order_service.dto.CreateOrderRequest;
import org.example.order_service.dto.OrderResponse;
import java.util.List;


public interface OrderService {

    OrderResponse createOrder(CreateOrderRequest request);

    OrderResponse addItemToOrder(Long orderId, AddItemRequest request);

    OrderResponse removeItemFromOrder(Long orderId, Long itemId);

    OrderResponse updateOrderStatus(Long orderId, OrderStatus status);

    OrderResponse getOrderById(Long id);

    List<OrderResponse> getOrdersForCustomer(Long customerId);

    List<OrderResponse> getOrdersByRestaurant(Long restaurantId);

    OrderResponse calculateTotal(Long orderId);
}

