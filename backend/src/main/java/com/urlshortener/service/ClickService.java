package com.urlshortener.service;

import com.urlshortener.dto.ClickResponse;
import com.urlshortener.entity.Click;
import com.urlshortener.entity.Url;
import com.urlshortener.exception.BadRequestException;
import com.urlshortener.exception.ResourceNotFoundException;
import com.urlshortener.repository.ClickRepository;
import com.urlshortener.repository.UrlRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
public class ClickService {

    private static final Logger log = LoggerFactory.getLogger(ClickService.class);

    private final ClickRepository clickRepository;
    private final UrlRepository urlRepository;

    public ClickService(ClickRepository clickRepository, UrlRepository urlRepository) {
        this.clickRepository = clickRepository;
        this.urlRepository = urlRepository;
    }

    @Transactional
    public void recordClick(Long urlId, String city, String country, String device, String browser, String os, String referrer) {
        saveClickInternal(urlId, city, country, device, browser, os, referrer);
    }

    @Async
    @Transactional
    public CompletableFuture<Void> recordClickAsync(Long urlId, String city, String country, String device, String browser, String os, String referrer) {
        try {
            saveClickInternal(urlId, city, country, device, browser, os, referrer);
        } catch (Exception e) {
            log.error("Failed to asynchronously record click for urlId={}: {}", urlId, e.getMessage());
        }
        return CompletableFuture.completedFuture(null);
    }

    private void saveClickInternal(Long urlId, String city, String country, String device, String browser, String os, String referrer) {
        Url url = urlRepository.findById(urlId)
                .orElseThrow(() -> new ResourceNotFoundException("URL not found with id: " + urlId));

        int newCount = (url.getClickCount() == null ? 0 : url.getClickCount()) + 1;
        url.setClickCount(newCount);
        if (url.getMaxClicks() != null && newCount >= url.getMaxClicks()) {
            url.setIsActive(false);
        }
        urlRepository.save(url);

        Click click = Click.builder()
                .url(url)
                .city(city != null && !city.isBlank() ? city : "Unknown")
                .country(country != null && !country.isBlank() ? country : "Unknown")
                .device(device != null && !device.isBlank() ? device : "desktop")
                .browser(browser != null && !browser.isBlank() ? browser : "Unknown")
                .os(os != null && !os.isBlank() ? os : "Unknown")
                .referrer(referrer != null && !referrer.isBlank() ? referrer : "Direct")
                .build();

        clickRepository.save(click);
    }

    @Transactional(readOnly = true)
    public List<ClickResponse> getClicksForUrl(Long urlId, Long userId) {
        Url url = urlRepository.findById(urlId)
                .orElseThrow(() -> new ResourceNotFoundException("URL not found"));
        if (!url.getUser().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized access to statistics");
        }

        return clickRepository.findAllByUrlIdOrderByCreatedAtDesc(urlId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ClickResponse> getClicksForUrls(List<Long> urlIds, Long userId) {
        if (urlIds == null || urlIds.isEmpty()) {
            return List.of();
        }

        // Validate that all URLs belong to the user
        List<Url> userUrls = urlRepository.findAllById(urlIds);
        for (Url url : userUrls) {
            if (!url.getUser().getId().equals(userId)) {
                throw new BadRequestException("Unauthorized access to statistics");
            }
        }

        return clickRepository.findAllByUrlIdIn(urlIds)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private ClickResponse mapToResponse(Click click) {
        return ClickResponse.builder()
                .id(click.getId())
                .urlId(click.getUrl().getId())
                .city(click.getCity())
                .country(click.getCountry())
                .device(click.getDevice())
                .browser(click.getBrowser())
                .os(click.getOs())
                .referrer(click.getReferrer())
                .createdAt(click.getCreatedAt())
                .build();
    }
}
