package org.example.note_service2.dto;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantDTO {
    private Long id;
    private String name;
    private String address;
    private String phoneNumber;
    private String email;
    private String description;
}
