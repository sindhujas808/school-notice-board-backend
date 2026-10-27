package com.school.noticeboard.dto.response;

import com.school.noticeboard.enums.AudienceType;
import com.school.noticeboard.enums.NoticeStatus;
import com.school.noticeboard.enums.Priority;
import com.school.noticeboard.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NoticeDTO {

    private Long id;
    private String title;
    private String content;

    private Long authorId;
    private String authorName;
    private String authorRole;

    private Long categoryId;
    private String categoryName;
    private String categoryColor;

    private Long departmentId;
    private String departmentName;

    private NoticeStatus status;
    private Priority priority;
    private AudienceType audienceType;
    private Set<Role> targetRoles;

    private LocalDateTime publishDate;
    private LocalDateTime expiryDate;
    private Long readCount;
    private Double engagementScore;
    private boolean isPinned;

    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    private List<AttachmentDTO> attachments;
    private int commentCount;
    private long likeCount;
}
