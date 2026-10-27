package com.school.noticeboard.service;

import com.school.noticeboard.dto.request.LoginRequest;
import com.school.noticeboard.dto.request.RefreshTokenRequest;
import com.school.noticeboard.dto.request.RegisterRequest;
import com.school.noticeboard.dto.response.JwtResponse;
import com.school.noticeboard.dto.response.UserDTO;

public interface AuthService {
    JwtResponse login(LoginRequest request, String ipAddress);
    UserDTO register(RegisterRequest request, String ipAddress);
    JwtResponse refreshToken(RefreshTokenRequest request);
    UserDTO getCurrentUser(String username);
}
