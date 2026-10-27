package com.school.noticeboard.dto.request;

import com.school.noticeboard.enums.AudienceType;
import com.school.noticeboard.enums.NoticeStatus;
import com.school.noticeboard.enums.Priority;
import com.school.noticeboard.enums.Role;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NoticeCreateRequest {

    @NotBlank(message = "Title cannot be blank")
    private String title;

    @NotBlank(message = "Content cannot be blank")
    private String content;

    private Long categoryId;
    private String categoryName;

    private Long departmentId;

    @Builder.Default
    private Priority priority = Priority.MEDIUM;

    @Builder.Default
    private AudienceType audienceType = AudienceType.PUBLIC;

    private Set<Role> targetRoles;

    private LocalDateTime publishDate;
    private LocalDateTime expiryDate;

    @Builder.Default
    private NoticeStatus status = NoticeStatus.PUBLISHED;

    @Builder.Default
    private boolean isPinned = false;
}
