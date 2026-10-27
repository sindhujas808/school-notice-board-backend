package com.school.noticeboard.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NoticeStatsDTO {

    private Long noticeId;
    private String title;
    private Long totalNotifications;
    private Long readCount;
    private Double likeRate;

    public NoticeStatsDTO(Long noticeId, String title, Long totalNotifications, Long readCount) {
        this.noticeId = noticeId;
        this.title = title;
        this.totalNotifications = totalNotifications;
        this.readCount = readCount;
        this.likeRate = 0.0;
    }
}
