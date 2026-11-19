package com.urlshortener.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClickResponse {
    private Long id;
    private Long urlId;
    private String city;
    private String country;
    private String device;
    private String browser;
    private String os;
    private String referrer;
    private LocalDateTime createdAt;
}
