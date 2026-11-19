package com.urlshortener.controller;

import com.urlshortener.dto.AuthResponse;
import com.urlshortener.dto.UserLoginRequest;
import com.urlshortener.dto.UserRegisterRequest;
import com.urlshortener.dto.UserResponse;
import com.urlshortener.entity.User;
import com.urlshortener.security.CustomUserDetails;
import com.urlshortener.security.JwtTokenProvider;
import com.urlshortener.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtTokenProvider tokenProvider;

    public AuthController(AuthenticationManager authenticationManager,
                          UserService userService,
                          JwtTokenProvider tokenProvider) {
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.tokenProvider = tokenProvider;
    }

    @PostMapping(value = "/register", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UserResponse> registerUser(
            @RequestParam("name") String name,
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam(value = "profilePic", required = false) MultipartFile profilePic) {
        
        UserRegisterRequest request = UserRegisterRequest.builder()
                .name(name)
                .email(email)
                .password(password)
                .build();
                
        UserResponse userResponse = userService.register(request, profilePic);
        return ResponseEntity.ok(userResponse);
    }

    @PostMapping(value = "/register", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<UserResponse> registerUserJson(@Valid @RequestBody UserRegisterRequest request) {
        UserResponse userResponse = userService.register(request, null);
        return ResponseEntity.ok(userResponse);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> authenticateUser(@Valid @RequestBody UserLoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);
        
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        UserResponse userResponse = userService.mapToResponse(userDetails.getUser());

        return ResponseEntity.ok(new AuthResponse(jwt, userResponse));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        UserResponse userResponse = userService.mapToResponse(userDetails.getUser());
        return ResponseEntity.ok(userResponse);
    }
}
