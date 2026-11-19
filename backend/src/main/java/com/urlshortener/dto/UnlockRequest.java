package com.urlshortener.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UnlockRequest {
    @NotBlank(message = "Password is required")
    private String password;
}
