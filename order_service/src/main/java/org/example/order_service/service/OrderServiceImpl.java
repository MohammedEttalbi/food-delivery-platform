package org.example.order_service.service;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.example.order_service.dto.AddItemRequest;
import org.example.order_service.dto.CreateOrderRequest;
import org.example.order_service.dto.OrderResponse;
import org.example.order_service.mapper.OrderMapper;
import org.example.order_service.model.MenuItem;
import org.example.order_service.model.Order;
import org.example.order_service.model.OrderItem;
import org.example.order_service.model.OrderStatus;
import org.example.order_service.repository.MenuItemRepository;
import org.example.order_service.repository.OrderRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;


@Service
@RequiredArgsConstructor
@Transactional
public class OrderServiceImpl implements OrderService {

    private final OrderRepository orderRepository;
    private final MenuItemRepository menuItemRepository;
    private final OrderMapper orderMapper;

    @Override
    public OrderResponse createOrder(CreateOrderRequest request) {

        Order order = new Order();

        order.setCustomerId(request.getCustomerId());
        order.setRestaurantId(request.getRestaurantId());
        order.setStatus(OrderStatus.PENDING);
        order.setCreatedAt(LocalDateTime.now());

        order = orderRepository.save(order);

        return orderMapper.toResponse(order);
    }


    @Override
    public OrderResponse addItemToOrder(Long orderId, AddItemRequest request) {

        Order order = getOrder(orderId);

        MenuItem menuItem = menuItemRepository.findById(request.getMenuItemId())
                .orElseThrow(() -> new RuntimeException("Menu item not found"));

        OrderItem item = new OrderItem();

        item.setMenuItem(menuItem);
        item.setQuantity(request.getQuantity());
        item.setPrice(menuItem.getPrice() * request.getQuantity());
        item.setOrder(order);

        order.getItems().add(item);
        order.updateTotalPrice();

        return orderMapper.toResponse(orderRepository.save(order));
    }


    @Override
    public OrderResponse removeItemFromOrder(Long orderId, Long itemId) {

        Order order = getOrder(orderId);

        order.removeItem(itemId);
        order.updateTotalPrice();

        return orderMapper.toResponse(orderRepository.save(order));
    }


    @Override
    public OrderResponse updateOrderStatus(Long orderId, OrderStatus status) {

        Order order = getOrder(orderId);
        order.setStatus(status);

        return orderMapper.toResponse(orderRepository.save(order));
    }


    @Override
    public OrderResponse getOrderById(Long id) {

        return orderMapper.toResponse(getOrder(id));
    }


    @Override
    public List<OrderResponse> getOrdersForCustomer(Long customerId) {

        return orderMapper.toResponseList(orderRepository.findByCustomerId(customerId));
    }


    @Override
    public List<OrderResponse> getOrdersByRestaurant(Long restaurantId) {

        return orderMapper.toResponseList(orderRepository.findByRestaurantId(restaurantId));
    }


    @Override
    public OrderResponse calculateTotal(Long orderId) {

        Order order = getOrder(orderId);
        order.updateTotalPrice();

        return orderMapper.toResponse(orderRepository.save(order));
    }


    private Order getOrder(Long id) {

        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }
}

