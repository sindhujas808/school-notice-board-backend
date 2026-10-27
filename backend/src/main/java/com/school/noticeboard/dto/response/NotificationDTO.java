package com.school.noticeboard.dto.response;

import com.school.noticeboard.enums.EngagementType;
import com.school.noticeboard.enums.ReadStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationDTO {
    private Long id;
    private Long noticeId;
    private String noticeTitle;
    private String title;
    private String message;
    private ReadStatus readStatus;
    private EngagementType engagementType;
    private LocalDateTime createdAt;
    private LocalDateTime readAt;
}
