package com.fooddeliverypatform.restaurantservice.config;

import com.fooddeliverypatform.restaurantservice.model.Restaurant;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

@Configuration
public class SpringDataRestConfig implements RepositoryRestConfigurer {

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config,
                                                     CorsRegistry cors) {
        // Exposer l'id de Restaurant dans le JSON
        config.exposeIdsFor(Restaurant.class);
        // Si tu veux aussi exposer d'autres entités : Menu.class, etc.
        // config.exposeIdsFor(Restaurant.class, Menu.class);
    }
}