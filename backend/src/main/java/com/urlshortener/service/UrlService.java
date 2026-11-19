package com.urlshortener.service;

import com.urlshortener.dto.UrlRequest;
import com.urlshortener.dto.UrlResponse;
import com.urlshortener.entity.Url;
import com.urlshortener.entity.User;
import com.urlshortener.exception.BadRequestException;
import com.urlshortener.exception.ResourceNotFoundException;
import com.urlshortener.repository.UrlRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Service
public class UrlService {

    private final UrlRepository urlRepository;
    private final QrCodeService qrCodeService;
    private final PasswordEncoder passwordEncoder;
    private final Random random = new Random();

    @org.springframework.beans.factory.annotation.Value("${app.frontend-url:https://trimrr-urlshortner.vercel.app}")
    private String frontendUrl;

    public UrlService(UrlRepository urlRepository,
                      QrCodeService qrCodeService,
                      PasswordEncoder passwordEncoder) {
        this.urlRepository = urlRepository;
        this.qrCodeService = qrCodeService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UrlResponse createUrl(UrlRequest request, User user) {
        String shortCode;
        if (request.getCustomUrl() != null && !request.getCustomUrl().trim().isEmpty()) {
            String customUrl = request.getCustomUrl().trim();
            if (urlRepository.existsByCustomUrl(customUrl) || urlRepository.existsByShortUrl(customUrl)) {
                throw new BadRequestException("Custom alias is already in use. Please choose another.");
            }
            shortCode = customUrl;
        } else {
            shortCode = generateRandomShortCode();
        }

        String fgColor = request.getQrForegroundColor() != null && !request.getQrForegroundColor().isBlank()
                ? request.getQrForegroundColor().trim()
                : "#0F172A";
        String bgColor = request.getQrBackgroundColor() != null && !request.getQrBackgroundColor().isBlank()
                ? request.getQrBackgroundColor().trim()
                : "#FFFFFF";

        // Target URL encoded in the QR code (pointing to the live short URL)
        String baseUrl = (frontendUrl != null && !frontendUrl.isBlank()) ? frontendUrl.trim() : "https://trimrr-urlshortner.vercel.app";
        if (baseUrl.endsWith("/")) {
            baseUrl = baseUrl.substring(0, baseUrl.length() - 1);
        }
        String redirectTargetUrl = baseUrl + "/" + shortCode;
        String qrCodeBase64 = qrCodeService.generateQrCodeBase64(redirectTargetUrl, 300, 300, fgColor, bgColor);

        String encodedPassword = null;
        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            encodedPassword = passwordEncoder.encode(request.getPassword().trim());
        }

        String originalUrl = request.getOriginalUrl().trim();
        if (!originalUrl.startsWith("http://") && !originalUrl.startsWith("https://")) {
            originalUrl = "https://" + originalUrl;
        }

        Url url = Url.builder()
                .title(request.getTitle())
                .originalUrl(originalUrl)
                .shortUrl(shortCode)
                .customUrl(request.getCustomUrl() != null && !request.getCustomUrl().trim().isEmpty() ? request.getCustomUrl().trim() : null)
                .qrCode(qrCodeBase64)
                .qrForegroundColor(fgColor)
                .qrBackgroundColor(bgColor)
                .password(encodedPassword)
                .maxClicks(request.getMaxClicks() != null && request.getMaxClicks() > 0 ? request.getMaxClicks() : null)
                .expiresAt(request.getExpiresAt())
                .user(user)
                .isActive(true)
                .clickCount(0)
                .build();

        Url savedUrl = urlRepository.save(url);
        return mapToResponse(savedUrl);
    }

    @Transactional(readOnly = true)
    public List<UrlResponse> getUserUrls(Long userId) {
        return urlRepository.findAllByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UrlResponse getUrlDetails(Long id, Long userId) {
        Url url = urlRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Short URL not found"));
        if (!url.getUser().getId().equals(userId)) {
            throw new BadRequestException("You do not have permission to view this URL's details");
        }
        return mapToResponse(url);
    }

    @Transactional
    public Url resolveUrl(String code) {
        Url url = urlRepository.findByShortUrlOrCustomUrl(code)
                .orElseThrow(() -> new ResourceNotFoundException("Short URL not found"));

        if (!url.getIsActive()) {
            throw new BadRequestException("This link has been deactivated or reached its usage limit.");
        }

        if (url.getExpiresAt() != null && url.getExpiresAt().isBefore(LocalDateTime.now())) {
            url.setIsActive(false);
            urlRepository.save(url);
            throw new BadRequestException("This link has expired.");
        }

        if (url.getMaxClicks() != null && url.getClickCount() >= url.getMaxClicks()) {
            url.setIsActive(false);
            urlRepository.save(url);
            throw new BadRequestException("This burner link reached its maximum click limit and has self-destructed.");
        }

        return url;
    }

    @Transactional
    public Url verifyPasswordAndResolve(String code, String rawPassword) {
        Url url = resolveUrl(code);

        if (url.getPassword() != null && !url.getPassword().isBlank()) {
            if (rawPassword == null || !passwordEncoder.matches(rawPassword, url.getPassword())) {
                throw new BadRequestException("Incorrect password for this protected link.");
            }
        }

        return incrementClick(url);
    }

    @Transactional
    public Url incrementClick(Url url) {
        url.setClickCount(url.getClickCount() + 1);

        // Auto-destruct if max clicks reached after this click
        if (url.getMaxClicks() != null && url.getClickCount() >= url.getMaxClicks()) {
            url.setIsActive(false);
        }

        return urlRepository.save(url);
    }

    @Transactional
    public void deleteUrl(Long id, Long userId) {
        Url url = urlRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Short URL not found"));
        if (!url.getUser().getId().equals(userId)) {
            throw new BadRequestException("You do not have permission to delete this URL");
        }
        urlRepository.delete(url);
    }

    @Transactional
    public UrlResponse toggleUrlStatus(Long id, Boolean isActive, Long userId) {
        Url url = urlRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Short URL not found"));
        if (!url.getUser().getId().equals(userId)) {
            throw new BadRequestException("You do not have permission to modify this URL");
        }
        url.setIsActive(isActive);
        Url savedUrl = urlRepository.save(url);
        return mapToResponse(savedUrl);
    }

    private String generateRandomShortCode() {
        String characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        StringBuilder code = new StringBuilder();
        do {
            code.setLength(0);
            for (int i = 0; i < 6; i++) {
                code.append(characters.charAt(random.nextInt(characters.length())));
            }
        } while (urlRepository.existsByShortUrl(code.toString()));
        return code.toString();
    }

    public UrlResponse mapToResponse(Url url) {
        boolean isExpired = (url.getExpiresAt() != null && url.getExpiresAt().isBefore(LocalDateTime.now()))
                || (url.getMaxClicks() != null && url.getClickCount() >= url.getMaxClicks());

        // Ensure QR code always encodes the live frontend URL (fixes any legacy or localhost QR codes)
        String baseUrl = (frontendUrl != null && !frontendUrl.isBlank()) ? frontendUrl.trim() : "https://trimrr-urlshortner.vercel.app";
        if (baseUrl.endsWith("/")) {
            baseUrl = baseUrl.substring(0, baseUrl.length() - 1);
        }
        String liveTarget = baseUrl + "/" + (url.getCustomUrl() != null && !url.getCustomUrl().isBlank() ? url.getCustomUrl() : url.getShortUrl());

        String qrCode = url.getQrCode();
        try {
            qrCode = qrCodeService.generateQrCodeBase64(
                    liveTarget, 300, 300,
                    url.getQrForegroundColor() != null ? url.getQrForegroundColor() : "#0F172A",
                    url.getQrBackgroundColor() != null ? url.getQrBackgroundColor() : "#FFFFFF"
            );
        } catch (Exception e) {
            // Keep existing if dynamic generation fails
        }

        return UrlResponse.builder()
                .id(url.getId())
                .title(url.getTitle())
                .originalUrl(url.getOriginalUrl())
                .shortUrl(url.getShortUrl())
                .customUrl(url.getCustomUrl())
                .qrCode(qrCode)
                .qrForegroundColor(url.getQrForegroundColor())
                .qrBackgroundColor(url.getQrBackgroundColor())
                .expiresAt(url.getExpiresAt())
                .isActive(url.getIsActive() && !isExpired)
                .clickCount(url.getClickCount())
                .maxClicks(url.getMaxClicks())
                .hasPassword(url.getPassword() != null && !url.getPassword().isBlank())
                .isExpired(isExpired)
                .createdAt(url.getCreatedAt())
                .updatedAt(url.getUpdatedAt())
                .build();
    }
}
