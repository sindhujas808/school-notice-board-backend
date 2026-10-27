package com.school.noticeboard.controller;

import com.school.noticeboard.dto.request.LoginRequest;
import com.school.noticeboard.dto.request.RefreshTokenRequest;
import com.school.noticeboard.dto.request.RegisterRequest;
import com.school.noticeboard.dto.response.ApiResponse;
import com.school.noticeboard.dto.response.JwtResponse;
import com.school.noticeboard.dto.response.UserDTO;
import com.school.noticeboard.service.AuthService;
import com.school.noticeboard.service.RefreshTokenService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final RefreshTokenService refreshTokenService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<JwtResponse>> login(@Valid @RequestBody LoginRequest request, HttpServletRequest httpRequest) {
        String ipAddress = httpRequest.getRemoteAddr();
        JwtResponse jwtResponse = authService.login(request, ipAddress);
        return ResponseEntity.ok(ApiResponse.success("Login successful", jwtResponse));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<UserDTO>> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletRequest httpRequest,
            Authentication authentication
    ) {
        if (request.getRole() == com.school.noticeboard.enums.Role.ADMIN) {
            boolean isAdmin = authentication != null && authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            if (!isAdmin) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(ApiResponse.error("Public registration for Administrator role is not allowed."));
            }
        }
        String ipAddress = httpRequest.getRemoteAddr();
        UserDTO userDTO = authService.register(request, ipAddress);
        return new ResponseEntity<>(ApiResponse.success("User registered successfully", userDTO), HttpStatus.CREATED);
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<JwtResponse>> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        JwtResponse jwtResponse = authService.refreshToken(request);
        return ResponseEntity.ok(ApiResponse.success("Token refreshed successfully", jwtResponse));
    }

    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDTO>> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(ApiResponse.error("Not authenticated"));
        }
        UserDTO userDTO = authService.getCurrentUser(authentication.getName());
        return ResponseEntity.ok(ApiResponse.success("Current user fetched", userDTO));
    }

    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<String>> logout(Authentication authentication) {
        if (authentication != null) {
            UserDTO user = authService.getCurrentUser(authentication.getName());
            refreshTokenService.deleteByUserId(user.getId());
        }
        return ResponseEntity.ok(ApiResponse.success("Logged out successfully", null));
    }
}
