package com.fooddeliverypatform.gatewayservice;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();

        // Allow frontend origins
        corsConfig.addAllowedOrigin("http://localhost:5173");
        corsConfig.addAllowedOrigin("http://localhost:3000");
        corsConfig.addAllowedOrigin("http://127.0.0.1:5173");

        // Allow all HTTP methods
        corsConfig.addAllowedMethod("*");

        // Allow all headers
        corsConfig.addAllowedHeader("*");

        // Don't require credentials for simpler CORS
        corsConfig.setAllowCredentials(false);

        // Max age for preflight cache
        corsConfig.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        return new CorsWebFilter(source);
    }
}
