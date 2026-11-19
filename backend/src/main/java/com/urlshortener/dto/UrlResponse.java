package com.urlshortener.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UrlResponse {
    private Long id;
    private String title;
    private String originalUrl;
    private String shortUrl;
    private String customUrl;
    private String qrCode;
    private String qrForegroundColor;
    private String qrBackgroundColor;
    private LocalDateTime expiresAt;
    private Boolean isActive;
    private Integer clickCount;
    private Integer maxClicks;
    private Boolean hasPassword;
    private Boolean isExpired;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
