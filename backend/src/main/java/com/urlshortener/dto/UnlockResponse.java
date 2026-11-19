package com.urlshortener.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UnlockResponse {
    private String originalUrl;
    private String title;
    private boolean success;
}
