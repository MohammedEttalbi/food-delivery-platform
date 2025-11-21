package org.example.order_service.mapper;

import org.example.order_service.dto.OrderItemResponse;
import org.example.order_service.dto.OrderResponse;
import org.example.order_service.model.Order;
import org.example.order_service.model.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderMapper {

    @Mapping(target = "items", source = "items")
    OrderResponse toResponse(Order order);

    List<OrderResponse> toResponseList(List<Order> orders);

    @Mapping(target = "menuItemId", source = "menuItem.id")
    @Mapping(target = "menuItemName", source = "menuItem.name")
    OrderItemResponse toItemResponse(OrderItem item);
}
