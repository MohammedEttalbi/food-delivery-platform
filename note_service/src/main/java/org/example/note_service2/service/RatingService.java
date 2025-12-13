package org.example.note_service2.service;

import org.example.note_service2.dto.CreateRatingRequest;
import org.example.note_service2.dto.RatingResponse;
import java.util.List;


public interface RatingService {

    RatingResponse create(CreateRatingRequest request);
    List<RatingResponse> getByRestaurant(Long restaurantId);
    void delete(Long id);
    Double averageForRestaurant(Long restaurantId);
}

