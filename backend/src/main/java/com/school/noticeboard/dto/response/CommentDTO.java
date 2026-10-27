package com.school.noticeboard.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CommentDTO {
    private Long id;
    private Long noticeId;
    private Long userId;
    private String username;
    private String userFullName;
    private String userRole;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
