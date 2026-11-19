package com.urlshortener.controller;

import com.urlshortener.entity.Url;
import com.urlshortener.service.ClickService;
import com.urlshortener.service.UrlService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.io.IOException;

@Controller
public class RedirectController {

    private final UrlService urlService;
    private final ClickService clickService;
    private final String frontendUrl;

    public RedirectController(UrlService urlService, 
                              ClickService clickService,
                              @org.springframework.beans.factory.annotation.Value("${app.frontend-url:https://trimrr-urlshortner.vercel.app}") String frontendUrl) {
        this.urlService = urlService;
        this.clickService = clickService;
        this.frontendUrl = frontendUrl.endsWith("/") ? frontendUrl.substring(0, frontendUrl.length() - 1) : frontendUrl;
    }

    @GetMapping("/r/{code}")
    public void handleRedirect(
            @PathVariable("code") String code,
            HttpServletRequest request,
            HttpServletResponse response) throws IOException {

        Url url;
        try {
            url = urlService.resolveUrl(code);
        } catch (Exception e) {
            // Redirect to frontend error/expired notice
            response.sendRedirect(frontendUrl + "/?error=" + java.net.URLEncoder.encode(e.getMessage(), "UTF-8"));
            return;
        }

        // If link is password protected, divert visitor to password unlock page
        if (url.getPassword() != null && !url.getPassword().isBlank()) {
            response.sendRedirect(frontendUrl + "/unlock/" + code);
            return;
        }

        // Increment click count (and handle auto-destruct limit)
        urlService.incrementClick(url);

        String userAgent = request.getHeader("User-Agent");
        String referrer = request.getHeader("Referer");
        String ipAddress = getClientIp(request);

        String os = parseOs(userAgent);
        String browser = parseBrowser(userAgent);
        String device = parseDevice(userAgent);

        // Async non-blocking click tracking: avoids any network latency during redirect
        clickService.recordClickAsync(url.getId(), "Localhost", "Localhost", device, browser, os, referrer);

        // Instant HTTP 302 redirect
        String destination = url.getOriginalUrl();
        if (!destination.startsWith("http://") && !destination.startsWith("https://")) {
            destination = "https://" + destination;
        }
        response.sendRedirect(destination);
    }

    private String getClientIp(HttpServletRequest request) {
        String ip = request.getHeader("X-Forwarded-For");
        if (ip == null || ip.isEmpty() || "unknown".equalsIgnoreCase(ip)) {
            ip = request.getRemoteAddr();
        }
        if (ip != null && ip.contains(",")) {
            ip = ip.split(",")[0].trim();
        }
        return ip;
    }

    private String parseOs(String ua) {
        if (ua == null) return "Unknown";
        String lower = ua.toLowerCase();
        if (lower.contains("windows")) return "Windows";
        if (lower.contains("macintosh") || lower.contains("mac os")) return "macOS";
        if (lower.contains("android")) return "Android";
        if (lower.contains("iphone") || lower.contains("ipad") || lower.contains("ipod")) return "iOS";
        if (lower.contains("linux")) return "Linux";
        return "Unknown";
    }

    private String parseBrowser(String ua) {
        if (ua == null) return "Unknown";
        String lower = ua.toLowerCase();
        if (lower.contains("chrome") && !lower.contains("chromium") && !lower.contains("edg") && !lower.contains("opr")) return "Chrome";
        if (lower.contains("safari") && !lower.contains("chrome") && !lower.contains("android")) return "Safari";
        if (lower.contains("firefox")) return "Firefox";
        if (lower.contains("edge") || lower.contains("edg")) return "Edge";
        if (lower.contains("opera") || lower.contains("opr")) return "Opera";
        return "Unknown";
    }

    private String parseDevice(String ua) {
        if (ua == null) return "desktop";
        String lower = ua.toLowerCase();
        if (lower.contains("mobile") || lower.contains("android") || lower.contains("iphone")) return "mobile";
        if (lower.contains("tablet") || lower.contains("ipad")) return "tablet";
        return "desktop";
    }
}
