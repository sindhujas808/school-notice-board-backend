package com.school.noticeboard.service;

import com.school.noticeboard.dto.response.AnalyticsSummaryDTO;
import com.school.noticeboard.dto.response.CategoryEngagementDTO;
import com.school.noticeboard.dto.response.DepartmentPerformanceDTO;
import com.school.noticeboard.dto.response.NoticeStatsDTO;

import java.time.LocalDateTime;
import java.util.List;

public interface AnalyticsService {
    List<NoticeStatsDTO> getUserEngagementAnalytics(LocalDateTime startDate, LocalDateTime endDate);
    List<DepartmentPerformanceDTO> getDepartmentPerformanceAnalysis(LocalDateTime startDate);
    List<CategoryEngagementDTO> getContentCategoryAnalysis(LocalDateTime startDate, LocalDateTime endDate);
    AnalyticsSummaryDTO getAnalyticsSummary();
}
