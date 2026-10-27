package com.school.noticeboard.service;

import com.school.noticeboard.dto.response.UserDTO;
import com.school.noticeboard.enums.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UserService {
    List<UserDTO> getAllUsers();
    Page<UserDTO> getUsersPaged(Role role, Pageable pageable);
    UserDTO getUserById(Long id);
    UserDTO updateUser(Long id, com.school.noticeboard.dto.request.UserUpdateRequest request);
    UserDTO unlockUserAccount(Long id);
    void deleteUser(Long id);
}
