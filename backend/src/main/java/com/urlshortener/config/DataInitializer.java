package com.urlshortener.config;

import com.urlshortener.entity.Url;
import com.urlshortener.entity.User;
import com.urlshortener.repository.UrlRepository;
import com.urlshortener.repository.UserRepository;
import com.urlshortener.service.QrCodeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final UrlRepository urlRepository;
    private final PasswordEncoder passwordEncoder;
    private final QrCodeService qrCodeService;

    public DataInitializer(UserRepository userRepository,
                           UrlRepository urlRepository,
                           PasswordEncoder passwordEncoder,
                           QrCodeService qrCodeService) {
        this.userRepository = userRepository;
        this.urlRepository = urlRepository;
        this.passwordEncoder = passwordEncoder;
        this.qrCodeService = qrCodeService;
    }

    @Override
    public void run(String... args) {
        try {
            // Seed default demo user if not present
            if (userRepository.findByEmail("demo@trimrr.com").isEmpty()) {
                User demoUser = User.builder()
                        .name("Demo User")
                        .email("demo@trimrr.com")
                        .password(passwordEncoder.encode("password123"))
                        .profilePic(null)
                        .build();

                User savedUser = userRepository.save(demoUser);
                log.info("Initialized demo user: demo@trimrr.com / password123");

                // Seed sample demo links
                if (urlRepository.findAllByUserIdOrderByCreatedAtDesc(savedUser.getId()).isEmpty()) {
                    String qrCode = qrCodeService.generateQrCodeBase64(
                            "https://github.com/harisai-singuluri/URL-SHORTNER",
                            300, 300, "#4F46E5", "#FFFFFF"
                    );

                    Url demoUrl = Url.builder()
                            .title("Trimrr Project Repository")
                            .originalUrl("https://github.com/harisai-singuluri/URL-SHORTNER")
                            .shortUrl("demo77")
                            .customUrl("trimrr-repo")
                            .qrCode(qrCode)
                            .qrForegroundColor("#4F46E5")
                            .qrBackgroundColor("#FFFFFF")
                            .user(savedUser)
                            .isActive(true)
                            .clickCount(15)
                            .build();

                    urlRepository.save(demoUrl);
                    log.info("Initialized demo shortened URL: trimrr-repo (demo77)");
                }
            }
        } catch (Exception e) {
            log.warn("DataInitializer skipped or encountered an error: {}", e.getMessage());
        }
    }
}
