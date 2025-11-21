package org.example.order_service.client;

import org.example.order_service.model.MenuItem;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

/**
 * OpenFeign client for interacting with the external Menu service.
 *
 * By default, this client uses the URL configured at property key:
 *   menu.service.url (e.g., http://localhost:8081)
 *
 * You can also register the service in a discovery server and omit the URL,
 * keeping just the service name, if using Eureka/Nacos/etc.
 */
@FeignClient(name = "menu-service", url = "${menu.service.url:}")
public interface MenuServiceClient {

    @GetMapping("/api/menu-items/{id}")
    MenuItem getMenuItemById(@PathVariable("id") Long id);
}

