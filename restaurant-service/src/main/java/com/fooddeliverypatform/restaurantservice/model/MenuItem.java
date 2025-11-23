package com.fooddeliverypatform.restaurantservice.model;


import jakarta.persistence.*;
import lombok.Data;



@Data
@Entity
public class MenuItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private double price;

    @ManyToOne
    @JoinColumn(name = "menu_id")
    private Menu menu;
}

