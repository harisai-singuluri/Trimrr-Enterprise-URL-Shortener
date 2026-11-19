package com.urlshortener.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "urls")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Url {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(name = "original_url", nullable = false, length = 2048)
    private String originalUrl;

    @Column(name = "short_url", unique = true, nullable = false, length = 50)
    private String shortUrl;

    @Column(name = "custom_url", unique = true, length = 50)
    private String customUrl;

    @Column(name = "qr_code", length = 1048576) // to hold Base64 data URIs
    private String qrCode;

    @Column(name = "qr_fg_color", length = 10)
    @Builder.Default
    private String qrForegroundColor = "#0F172A";

    @Column(name = "qr_bg_color", length = 10)
    @Builder.Default
    private String qrBackgroundColor = "#FFFFFF";

    @Column(name = "password")
    private String password;

    @Column(name = "max_clicks")
    private Integer maxClicks;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private Boolean isActive = true;

    @Column(name = "click_count", nullable = false)
    @Builder.Default
    private Integer clickCount = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
