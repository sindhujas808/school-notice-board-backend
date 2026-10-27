package com.school.noticeboard.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CategoryEngagementDTO {

    private String categoryName;
    private Long noticeCount;
    private Double avgEngagement;
    private Long maxReads;
}
