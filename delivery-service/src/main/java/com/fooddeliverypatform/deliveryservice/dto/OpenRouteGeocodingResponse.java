package com.fooddeliverypatform.deliveryservice.dto;

import lombok.Data;

import java.util.List;

// DTO pour la réponse Geocoding
@Data
public class OpenRouteGeocodingResponse {
    private List<Feature> features;

    @Data
    public static class Feature {
        private Geometry geometry;
        private Properties properties;
    }

    @Data
    public static class Geometry {
        private List<Double> coordinates; // [longitude, latitude]
    }

    @Data
    public static class Properties {
        private String label;
        private String name;
        private String country;
        private String city;
    }
}

