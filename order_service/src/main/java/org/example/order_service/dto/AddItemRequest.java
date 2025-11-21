package org.example.order_service.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
public class AddItemRequest {

    private Long menuItemId;
    private Integer quantity;
}

