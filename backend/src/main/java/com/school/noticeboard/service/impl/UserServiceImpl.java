package com.school.noticeboard.service.impl;

import com.school.noticeboard.dto.response.UserDTO;
import com.school.noticeboard.entity.User;
import com.school.noticeboard.enums.Role;
import com.school.noticeboard.exception.ResourceNotFoundException;
import com.school.noticeboard.repository.UserRepository;
import com.school.noticeboard.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final com.school.noticeboard.repository.DepartmentRepository departmentRepository;
    private final com.school.noticeboard.repository.RefreshTokenRepository refreshTokenRepository;
    private final com.school.noticeboard.repository.UserNotificationRepository userNotificationRepository;
    private final com.school.noticeboard.repository.CommentRepository commentRepository;
    private final com.school.noticeboard.repository.AuditLogRepository auditLogRepository;

    @Override
    @Transactional(readOnly = true)
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserDTO> getUsersPaged(Role role, Pageable pageable) {
        if (role != null) {
            return userRepository.findByRole(role, pageable).map(this::mapToDTO);
        }
        return userRepository.findAll(pageable).map(this::mapToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        return mapToDTO(user);
    }

    @Override
    @Transactional
    public UserDTO updateUser(Long id, com.school.noticeboard.dto.request.UserUpdateRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) {
            user.setFullName(request.getFullName().trim());
        }
        if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            user.setEmail(request.getEmail().trim());
        }
        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }
        if (request.getDepartmentId() != null) {
            com.school.noticeboard.entity.Department dept = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + request.getDepartmentId()));
            user.setDepartment(dept);
        }
        if (request.getAccountNonLocked() != null) {
            user.setAccountNonLocked(request.getAccountNonLocked());
            if (request.getAccountNonLocked()) {
                user.setFailedAttempts(0);
            }
        }

        return mapToDTO(userRepository.save(user));
    }

    @Override
    @Transactional
    public UserDTO unlockUserAccount(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
        user.setAccountNonLocked(true);
        user.setFailedAttempts(0);
        return mapToDTO(userRepository.save(user));
    }

    @Override
    @Transactional
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new ResourceNotFoundException("User not found with id: " + id);
        }

        // 1. Delete refresh tokens belonging to the user safely
        refreshTokenRepository.deleteByUserId(id);

        // 2. Delete user notifications safely
        userNotificationRepository.deleteByUserId(id);

        // 3. Delete user comments safely
        commentRepository.deleteByUserId(id);

        // 4. Detach user reference in audit logs so historical logs remain intact
        auditLogRepository.clearUserReference(id);

        // 5. Delete user
        userRepository.deleteById(id);
    }

    private UserDTO mapToDTO(User user) {
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
