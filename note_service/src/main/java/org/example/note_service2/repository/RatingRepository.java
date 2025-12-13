package org.example.note_service2.repository;

import org.example.note_service2.model.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;


public interface RatingRepository extends JpaRepository<Rating, Long> {

    List<Rating> findByRestaurantId(Long restaurantId);

    @Query("select avg(r.score) from Rating r where r.restaurantId = :restaurantId")
    Double averageScoreByRestaurantId(Long restaurantId);
}

