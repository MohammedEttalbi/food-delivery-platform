package org.example.note_service2.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.antlr.v4.runtime.misc.NotNull;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CreateRatingRequest {

    @NotNull
    private Long restaurantId;

    @NotNull
    private Long userId;

    @NotNull
    @Min(1)
    @Max(5)
    private Integer score;

    @Size(max = 1000)
    private String comment;
}

