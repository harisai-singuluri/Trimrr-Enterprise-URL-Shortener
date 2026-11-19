package com.urlshortener;

import com.urlshortener.dto.UnlockRequest;
import com.urlshortener.dto.UnlockResponse;
import com.urlshortener.dto.UrlRequest;
import com.urlshortener.dto.UrlResponse;
import com.urlshortener.entity.User;
import com.urlshortener.exception.BadRequestException;
import com.urlshortener.repository.UserRepository;
import com.urlshortener.service.QrCodeService;
import com.urlshortener.service.UrlService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class BackendApplicationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UrlService urlService;

    @Autowired
    private QrCodeService qrCodeService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = userRepository.findByEmail("tester@enterprise.com")
                .orElseGet(() -> userRepository.save(User.builder()
                        .name("Test Engineer")
                        .email("tester@enterprise.com")
                        .password(passwordEncoder.encode("secretPassword123"))
                        .build()));
    }

    @Test
    @DisplayName("Verify QR Code Service generates high-resolution Base64 PNG with custom colors")
    void testQrCodeGeneration() {
        String qrBase64 = qrCodeService.generateQrCodeBase64("https://antigravity.dev", 300, 300, "#4F46E5", "#FFFFFF");
        assertNotNull(qrBase64, "QR code output should not be null");
        assertTrue(qrBase64.startsWith("data:image/png;base64,"), "QR code must be a valid PNG Base64 data URI");
        assertTrue(qrBase64.length() > 500, "QR code image data must contain valid binary length");
    }

    @Test
    @DisplayName("Verify Password Shield: sets encrypted passcode and prevents unauthorized redirection")
    void testPasswordShieldSecurity() {
        UrlRequest request = UrlRequest.builder()
                .title("Financial Confidential Sheet")
                .originalUrl("https://enterprise.internal/confidential-doc")
                .password("VaultSecret99")
                .build();

        UrlResponse created = urlService.createUrl(request, testUser);
        assertTrue(created.getHasPassword(), "Link response must confirm password shield is active");

        // Verify correct unlock password succeeds
        var resolved = urlService.verifyPasswordAndResolve(created.getShortUrl(), "VaultSecret99");
        assertEquals("https://enterprise.internal/confidential-doc", resolved.getOriginalUrl());

        // Verify wrong password is systematically rejected
        assertThrows(BadRequestException.class, () -> {
            urlService.verifyPasswordAndResolve(created.getShortUrl(), "WrongPassword");
        }, "Wrong password must be rejected with BadRequestException");
    }

    @Test
    @DisplayName("Verify Self-Destruct Burner Links: automatically deactivates after reaching max clicks")
    void testSelfDestructBurnerLink() {
        UrlRequest request = UrlRequest.builder()
                .title("One-Time Secret Token")
                .originalUrl("https://example.com/one-time-secret")
                .maxClicks(1) // Burner link: exactly 1 click allowed
                .build();

        UrlResponse created = urlService.createUrl(request, testUser);
        assertEquals(1, created.getMaxClicks());

        // First click succeeds
        var urlEntity = urlService.resolveUrl(created.getShortUrl());
        urlService.incrementClick(urlEntity);

        // Second click MUST fail because link self-destructed
        assertThrows(BadRequestException.class, () -> {
            urlService.resolveUrl(created.getShortUrl());
        }, "Subsequent visits to an exhausted burner link must be rejected");
    }

    @Test
    @DisplayName("Verify Login with unregistered email returns 401 with clear message")
    void testLoginWithUnregisteredEmail() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"singuluriharisai143@gmail.com\",\"password\":\"mypassword\"}"))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message").value("Invalid email or password. If you haven't created an account yet, please click 'Create Account' first or use Demo Login."));
    }

    @Test
    @DisplayName("Verify Demo account can log in successfully and receive JWT")
    void testDemoLoginSuccess() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"demo@trimrr.com\",\"password\":\"password123\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isString())
                .andExpect(jsonPath("$.user.email").value("demo@trimrr.com"));
    }
}
