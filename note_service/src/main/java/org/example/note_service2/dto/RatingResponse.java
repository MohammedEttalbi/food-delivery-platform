package org.example.note_service2.dto;

import lombok.*;
import java.time.Instant;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RatingResponse {

    private Long id;
    private Long restaurantId;
    private Long userId;
    private Integer score;
    private String comment;
    private Instant createdAt;
    private Instant updatedAt;
}

