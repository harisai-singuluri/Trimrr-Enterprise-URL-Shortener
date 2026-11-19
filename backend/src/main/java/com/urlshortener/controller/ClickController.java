package com.urlshortener.controller;

import com.urlshortener.dto.ClickResponse;
import com.urlshortener.security.CustomUserDetails;
import com.urlshortener.service.ClickService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/clicks")
public class ClickController {

    private final ClickService clickService;

    public ClickController(ClickService clickService) {
        this.clickService = clickService;
    }

    // Public click logging endpoint, used by client redirection page
    @PostMapping
    public ResponseEntity<Void> recordClick(@RequestBody Map<String, Object> payload) {
        Long urlId = Long.valueOf(payload.get("urlId").toString());
        String city = (String) payload.get("city");
        String country = (String) payload.get("country");
        String device = (String) payload.get("device");
        String browser = (String) payload.get("browser");
        String os = (String) payload.get("os");
        String referrer = (String) payload.get("referrer");

        clickService.recordClick(urlId, city, country, device, browser, os, referrer);
        return ResponseEntity.ok().build();
    }

    // Fetch click logs for a specific URL ID
    @GetMapping("/url/{urlId}")
    public ResponseEntity<List<ClickResponse>> getClicksForUrl(
            @PathVariable("urlId") Long urlId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<ClickResponse> clicks = clickService.getClicksForUrl(urlId, userDetails.getId());
        return ResponseEntity.ok(clicks);
    }

    // Fetch click logs for multiple URL IDs (e.g. dashboard stats)
    @GetMapping("/urls")
    public ResponseEntity<List<ClickResponse>> getClicksForUrls(
            @RequestParam("ids") List<Long> urlIds,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<ClickResponse> clicks = clickService.getClicksForUrls(urlIds, userDetails.getId());
        return ResponseEntity.ok(clicks);
    }
}
