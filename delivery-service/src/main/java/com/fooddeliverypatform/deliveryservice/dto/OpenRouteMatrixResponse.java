package com.fooddeliverypatform.deliveryservice.dto;

import lombok.Data;

import java.util.List;

// DTO pour la réponse Matrix (distances)
// DTO pour la réponse Matrix (distances) - Version simplifiée
@Data
public class OpenRouteMatrixResponse {
    private List<List<Double>> distances; // en mètres - matrice 2D
    private List<List<Double>> durations; // en secondes - matrice 2D

    // On ignore sources et destinations car leur structure peut varier
    // et nous n'en avons pas besoin pour calculer la distance
}


