package com.school.noticeboard.dto.request;

import com.school.noticeboard.enums.AudienceType;
import com.school.noticeboard.enums.NoticeStatus;
import com.school.noticeboard.enums.Priority;
import com.school.noticeboard.enums.Role;
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
public class NoticeUpdateRequest {

    private String title;
    private String content;
    private Long categoryId;
    private String categoryName;
    private Long departmentId;
    private Priority priority;
    private AudienceType audienceType;
    private Set<Role> targetRoles;
    private LocalDateTime publishDate;
    private LocalDateTime expiryDate;
    private NoticeStatus status;
    private Boolean isPinned;
}
