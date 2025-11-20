package com.fooddeliverypatform.restaurantservice.repository;

import com.fooddeliverypatform.restaurantservice.model.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(path = "menuItems")
public interface MenuItemRepository extends JpaRepository<MenuItem, Long> {
}