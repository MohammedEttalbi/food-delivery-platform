package org.example.order_service.mapper;

import org.example.order_service.dto.OrderResponse;
import org.example.order_service.model.Order;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface OrderMapper {

    // Restaurant is populated from Restaurant service in the Service layer
    @Mapping(target = "restaurant", ignore = true)
    OrderResponse toResponse(Order order);

    List<OrderResponse> toResponseList(List<Order> orders);
}
