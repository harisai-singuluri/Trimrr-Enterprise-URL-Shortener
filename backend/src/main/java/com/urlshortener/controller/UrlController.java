package com.urlshortener.controller;

import com.urlshortener.dto.UnlockRequest;
import com.urlshortener.dto.UnlockResponse;
import com.urlshortener.dto.UrlRequest;
import com.urlshortener.dto.UrlResponse;
import com.urlshortener.entity.Url;
import com.urlshortener.security.CustomUserDetails;
import com.urlshortener.service.UrlService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/urls")
public class UrlController {

    private final UrlService urlService;
    private final com.urlshortener.service.QrCodeService qrCodeService;

    public UrlController(UrlService urlService, com.urlshortener.service.QrCodeService qrCodeService) {
        this.urlService = urlService;
        this.qrCodeService = qrCodeService;
    }

    @PostMapping
    public ResponseEntity<UrlResponse> createUrl(
            @Valid @RequestBody UrlRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        UrlResponse response = urlService.createUrl(request, userDetails.getUser());
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<UrlResponse>> getUserUrls(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<UrlResponse> responses = urlService.getUserUrls(userDetails.getId());
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UrlResponse> getUrlDetails(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        UrlResponse response = urlService.getUrlDetails(id, userDetails.getId());
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUrl(
            @PathVariable("id") Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        urlService.deleteUrl(id, userDetails.getId());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<UrlResponse> toggleUrlStatus(
            @PathVariable("id") Long id,
            @RequestParam("isActive") Boolean isActive,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        UrlResponse response = urlService.toggleUrlStatus(id, isActive, userDetails.getId());
        return ResponseEntity.ok(response);
    }

    // Public endpoint for resolving a short URL code (metadata check)
    @GetMapping("/resolve/{code}")
    public ResponseEntity<UrlResponse> resolveUrl(@PathVariable("code") String code) {
        Url url = urlService.resolveUrl(code);
        UrlResponse response = urlService.mapToResponse(url);
        return ResponseEntity.ok(response);
    }

    // Public endpoint for unlocking password-protected short links
    @PostMapping("/unlock/{code}")
    public ResponseEntity<UnlockResponse> unlockUrl(
            @PathVariable("code") String code,
            @Valid @RequestBody UnlockRequest request) {
        Url url = urlService.verifyPasswordAndResolve(code, request.getPassword());
        return ResponseEntity.ok(UnlockResponse.builder()
                .originalUrl(url.getOriginalUrl())
                .title(url.getTitle())
                .success(true)
                .build());
    }

    // Public endpoint to generate live branded QR codes powered by ZXing Java Engine
    @GetMapping("/preview-qr")
    public ResponseEntity<java.util.Map<String, String>> previewQr(
            @RequestParam("text") String text,
            @RequestParam(value = "fgColor", defaultValue = "#0F172A") String fgColor,
            @RequestParam(value = "bgColor", defaultValue = "#FFFFFF") String bgColor) {
        String qr = qrCodeService.generateQrCodeBase64(text, 350, 350, fgColor, bgColor);
        return ResponseEntity.ok(java.util.Map.of("qrCode", qr));
    }
}
