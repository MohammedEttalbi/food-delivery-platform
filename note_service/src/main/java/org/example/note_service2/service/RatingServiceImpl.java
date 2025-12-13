package org.example.note_service2.service;

import feign.FeignException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.example.note_service2.client.RestaurantClient;
import org.example.note_service2.dto.CreateRatingRequest;
import org.example.note_service2.dto.RatingResponse;
import org.example.note_service2.dto.RestaurantDTO;
import org.example.note_service2.exception.RestaurantNotFoundException;
import org.example.note_service2.model.Rating;
import org.example.note_service2.repository.RatingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class RatingServiceImpl implements RatingService {

    private final RatingRepository ratingRepository;
    private final RestaurantClient restaurantClient;

    @Override
    public RatingResponse create(CreateRatingRequest request) {
        // Verify restaurant exists before creating rating
        validateRestaurantExists(request.getRestaurantId());

        Rating rating = Rating.builder()
                .restaurantId(request.getRestaurantId())
                .userId(request.getUserId())
                .score(request.getScore())
                .comment(request.getComment())
                .build();

        Rating saved = ratingRepository.save(rating);
        log.info("Created rating with id: {} for restaurant: {}", saved.getId(), saved.getRestaurantId());
        return toDto(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RatingResponse> getByRestaurant(Long restaurantId) {
        // Optionally validate restaurant exists when fetching ratings
        validateRestaurantExists(restaurantId);

        return ratingRepository.findByRestaurantId(restaurantId)
                .stream().map(this::toDto).toList();
    }

    @Override
    public void delete(Long id) {
        ratingRepository.deleteById(id);
        log.info("Deleted rating with id: {}", id);
    }

    @Override
    @Transactional(readOnly = true)
    public Double averageForRestaurant(Long restaurantId) {
        // Optionally validate restaurant exists when calculating average
        validateRestaurantExists(restaurantId);

        Double avg = ratingRepository.averageScoreByRestaurantId(restaurantId);
        return avg != null ? avg : 0.0;
    }

    private void validateRestaurantExists(Long restaurantId) {
        try {
            RestaurantDTO restaurant = restaurantClient.getRestaurantById(restaurantId);
            log.debug("Validated restaurant exists: {}", restaurant.getName());
        } catch (FeignException.NotFound e) {
            log.error("Restaurant not found with id: {}", restaurantId);
            throw new RestaurantNotFoundException(restaurantId);
        } catch (FeignException e) {
            log.error("Error communicating with restaurant service: {}", e.getMessage());
            throw e;
        }
    }

    private RatingResponse toDto(Rating r) {
        return RatingResponse.builder()
                .id(r.getId())
                .restaurantId(r.getRestaurantId())
                .userId(r.getUserId())
                .score(r.getScore())
                .comment(r.getComment())
                .createdAt(r.getCreatedAt())
                .updatedAt(r.getUpdatedAt())
                .build();
    }
}