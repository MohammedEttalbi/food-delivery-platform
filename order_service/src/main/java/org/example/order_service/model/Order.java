package org.example.order_service.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "orders")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long customerId;

    // Keep only the identifier to avoid depending on Restaurant entity, per requirements
    private Long restaurantId;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    private Double totalPrice = 0.0;

    @Enumerated(EnumType.STRING)
    private OrderStatus status;

    private LocalDateTime createdAt;


    public void updateTotalPrice() {

        this.totalPrice = items.stream()
                .mapToDouble(OrderItem::getPrice)
                .sum();
    }


    public void removeItem(Long itemId) {

        items.removeIf(i -> i.getId().equals(itemId));
    }
}

