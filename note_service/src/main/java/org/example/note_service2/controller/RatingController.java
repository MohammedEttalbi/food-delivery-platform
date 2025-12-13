package org.example.note_service2.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.example.note_service2.dto.CreateRatingRequest;
import org.example.note_service2.dto.RatingResponse;
import org.example.note_service2.dto.SimpleAverageResponse;
import org.example.note_service2.service.RatingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;


@RestController
@RequestMapping("/ratings")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService ratingService;

    @PostMapping
    public ResponseEntity<RatingResponse> create(@Valid @RequestBody CreateRatingRequest request) {
        RatingResponse created = ratingService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping("/restaurants/{restaurantId}")
    public ResponseEntity<List<RatingResponse>> getByRestaurant(@PathVariable Long restaurantId) {
        return ResponseEntity.ok(ratingService.getByRestaurant(restaurantId));
    }

    @GetMapping("/restaurants/{restaurantId}/average")
    public ResponseEntity<SimpleAverageResponse> getAverage(@PathVariable Long restaurantId) {
        Double avg = ratingService.averageForRestaurant(restaurantId);
        return ResponseEntity.ok(new SimpleAverageResponse(avg));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        ratingService.delete(id);
        return ResponseEntity.noContent().build();
    }
}

