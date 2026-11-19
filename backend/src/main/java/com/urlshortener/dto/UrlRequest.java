package com.urlshortener.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.validator.constraints.URL;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UrlRequest {

    @NotBlank(message = "Original URL is required")
    @URL(message = "Please provide a valid original URL")
    private String originalUrl;

    @NotBlank(message = "Title is required")
    private String title;

    private String customUrl;

    private LocalDateTime expiresAt;

    private String password;

    private Integer maxClicks;

    private String qrForegroundColor;

    private String qrBackgroundColor;
}
