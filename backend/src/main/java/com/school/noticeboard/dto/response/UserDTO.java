package com.school.noticeboard.dto.response;

import com.school.noticeboard.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserDTO {

    private Long id;
    private String username;
    private String email;
    private String fullName;
    private Role role;
    private Long departmentId;
    private String departmentName;
    private boolean accountNonLocked;
    private LocalDateTime createdAt;
}
