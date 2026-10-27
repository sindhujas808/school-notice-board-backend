package com.school.noticeboard.service.impl;

import com.school.noticeboard.dto.request.LoginRequest;
import com.school.noticeboard.dto.request.RefreshTokenRequest;
import com.school.noticeboard.dto.request.RegisterRequest;
import com.school.noticeboard.dto.response.JwtResponse;
import com.school.noticeboard.dto.response.UserDTO;
import com.school.noticeboard.entity.Department;
import com.school.noticeboard.entity.RefreshToken;
import com.school.noticeboard.entity.User;
import com.school.noticeboard.exception.BadRequestException;
import com.school.noticeboard.exception.DuplicateResourceException;
import com.school.noticeboard.exception.ResourceNotFoundException;
import com.school.noticeboard.exception.UnauthorizedException;
import com.school.noticeboard.repository.DepartmentRepository;
import com.school.noticeboard.repository.UserRepository;
import com.school.noticeboard.security.JwtUtils;
import com.school.noticeboard.security.UserPrincipal;
import com.school.noticeboard.service.AuditLogService;
import com.school.noticeboard.service.AuthService;
import com.school.noticeboard.service.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final RefreshTokenService refreshTokenService;
    private final AuditLogService auditLogService;

    @Override
    @Transactional
    public JwtResponse login(LoginRequest request, String ipAddress) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseGet(() -> userRepository.findByEmail(request.getUsername())
                        .orElse(null));

        if (user != null && !user.isAccountNonLocked()) {
            auditLogService.log(request.getUsername(), "LOGIN_LOCKED", "USER", user.getId(), "Login attempted on locked account", ipAddress);
            throw new UnauthorizedException("Your account is locked due to too many failed login attempts. Please contact Administrator.");
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();

            String jwt = jwtUtils.generateJwtToken(authentication);
            RefreshToken refreshToken = refreshTokenService.createRefreshToken(userPrincipal.getId());

            // Reset failed attempts on success
            if (user != null && user.getFailedAttempts() > 0) {
                user.setFailedAttempts(0);
                userRepository.save(user);
            }

            auditLogService.log(user, "LOGIN_SUCCESS", "USER", userPrincipal.getId(), "User logged in successfully", ipAddress);

            List<String> permissions = userPrincipal.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());

            return JwtResponse.builder()
                    .token(jwt)
                    .type("Bearer")
                    .refreshToken(refreshToken.getToken())
                    .id(userPrincipal.getId())
                    .username(userPrincipal.getUsername())
                    .email(userPrincipal.getEmail())
                    .fullName(userPrincipal.getFullName())
                    .role(userPrincipal.getRole().name())
                    .departmentId(userPrincipal.getDepartmentId())
                    .departmentName(userPrincipal.getDepartmentName())
                    .permissions(permissions)
                    .build();

        } catch (BadCredentialsException ex) {
            if (user != null) {
                int attempts = user.getFailedAttempts() + 1;
                user.setFailedAttempts(attempts);
                if (attempts >= 5) {
                    user.setAccountNonLocked(false);
                    log.warn("User {} locked after 5 failed login attempts", user.getUsername());
                }
                userRepository.save(user);
            }
            auditLogService.log(request.getUsername(), "LOGIN_FAILED", "USER", user != null ? user.getId() : null, "Failed login attempt", ipAddress);
            throw new BadCredentialsException("Invalid username or password");
        }
    }

    @Override
    @Transactional
    public UserDTO register(RegisterRequest request, String ipAddress) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new DuplicateResourceException("Username '" + request.getUsername() + "' is already taken");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email '" + request.getEmail() + "' is already in use");
        }

        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + request.getDepartmentId()));
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(request.getRole())
                .department(department)
                .failedAttempts(0)
                .accountNonLocked(true)
                .build();

        User savedUser = userRepository.save(user);

        auditLogService.log(savedUser, "USER_REGISTERED", "USER", savedUser.getId(), "User account registered with role " + savedUser.getRole(), ipAddress);

        return mapToUserDTO(savedUser);
    }

    @Override
    @Transactional
    public JwtResponse refreshToken(RefreshTokenRequest request) {
        return refreshTokenService.findByToken(request.getRefreshToken())
                .map(refreshTokenService::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    UserPrincipal userPrincipal = UserPrincipal.build(user);
                    String token = jwtUtils.generateTokenFromUserPrincipal(userPrincipal);
                    List<String> permissions = userPrincipal.getAuthorities().stream()
                            .map(GrantedAuthority::getAuthority)
                            .collect(Collectors.toList());

                    return JwtResponse.builder()
                            .token(token)
                            .type("Bearer")
                            .refreshToken(request.getRefreshToken())
                            .id(user.getId())
                            .username(user.getUsername())
                            .email(user.getEmail())
                            .fullName(user.getFullName())
                            .role(user.getRole().name())
                            .departmentId(user.getDepartment() != null ? user.getDepartment().getId() : null)
                            .departmentName(user.getDepartment() != null ? user.getDepartment().getDepartmentName() : null)
                            .permissions(permissions)
                            .build();
                })
                .orElseThrow(() -> new UnauthorizedException("Refresh token is not valid in database!"));
    }

    @Override
    @Transactional(readOnly = true)
    public UserDTO getCurrentUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        return mapToUserDTO(user);
    }

    private UserDTO mapToUserDTO(User user) {
        return UserDTO.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole())
                .departmentId(user.getDepartment() != null ? user.getDepartment().getId() : null)
                .departmentName(user.getDepartment() != null ? user.getDepartment().getDepartmentName() : null)
                .accountNonLocked(user.isAccountNonLocked())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
