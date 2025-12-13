package org.example.note_service2.exception;


public class RestaurantNotFoundException extends RuntimeException {
    public RestaurantNotFoundException(String message) {
        super(message);
    }

    public RestaurantNotFoundException(Long restaurantId) {
        super("Restaurant not found with id: " + restaurantId);
    }
}