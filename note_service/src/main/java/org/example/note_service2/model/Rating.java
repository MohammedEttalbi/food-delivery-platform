package org.example.note_service2.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.antlr.v4.runtime.misc.NotNull;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.Instant;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "ratings", indexes = {
        @Index(name = "idx_ratings_restaurant", columnList = "restaurant_id"),
        @Index(name = "idx_ratings_user", columnList = "user_id")
})
public class Rating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(name = "restaurant_id", nullable = false)
    private Long restaurantId;

    @NotNull
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Min(1)
    @Max(5)
    @NotNull
    @Column(name = "score", nullable = false)
    private Integer score;

    @Size(max = 1000)
    @Column(name = "comment", length = 1000)
    private String comment;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;
}

