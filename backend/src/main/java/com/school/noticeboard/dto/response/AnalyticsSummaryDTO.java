package com.school.noticeboard.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalyticsSummaryDTO {

    private long totalNotices;
    private long publishedNotices;
    private long draftNotices;
    private long urgentNotices;
    private long totalViews;
    private long totalLikes;
    private long totalUsers;
    private long totalDepartments;
    private long totalCategories;

    private List<DepartmentPerformanceDTO> departmentStats;
    private List<CategoryEngagementDTO> categoryStats;
    private List<NoticeStatsDTO> topNotices;
}
