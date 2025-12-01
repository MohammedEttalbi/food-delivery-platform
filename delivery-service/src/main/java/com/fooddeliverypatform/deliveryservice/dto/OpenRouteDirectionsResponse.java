package com.fooddeliverypatform.deliveryservice.dto;

import lombok.Data;

import java.util.List;

// DTO pour la réponse Directions
@Data
public class OpenRouteDirectionsResponse {
    private List<Route> routes;
    private Metadata metadata;

    @Data
    public static class Route {
        private Summary summary;
        private String geometry;
        private List<Segment> segments;
    }

    @Data
    public static class Summary {
        private Double distance; // en mètres
        private Double duration; // en secondes
    }

    @Data
    public static class Segment {
        private Double distance;
        private Double duration;
        private List<Step> steps;
    }

    @Data
    public static class Step {
        private Double distance;
        private Double duration;
        private String instruction;
    }

    @Data
    public static class Metadata {
        private String attribution;
        private String service;
        private Long timestamp;
    }
}
