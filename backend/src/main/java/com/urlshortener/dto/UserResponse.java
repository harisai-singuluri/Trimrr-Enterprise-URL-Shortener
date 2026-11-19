package com.urlshortener.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserResponse {
    private Long id;
    private String email;
    private String name;
    private String profilePic;
    private String role; // to match react app's 'authenticated' status check
    private LocalDateTime createdAt;
}
