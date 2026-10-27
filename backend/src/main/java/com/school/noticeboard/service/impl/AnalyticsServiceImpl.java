package com.school.noticeboard.service.impl;

import com.school.noticeboard.dto.response.AnalyticsSummaryDTO;
import com.school.noticeboard.dto.response.CategoryEngagementDTO;
import com.school.noticeboard.dto.response.DepartmentPerformanceDTO;
import com.school.noticeboard.dto.response.NoticeStatsDTO;
import com.school.noticeboard.enums.NoticeStatus;
import com.school.noticeboard.enums.Priority;
import com.school.noticeboard.repository.*;
import com.school.noticeboard.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AnalyticsServiceImpl implements AnalyticsService {

    private final NoticeRepository noticeRepository;
    private final DepartmentRepository departmentRepository;
    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final UserNotificationRepository notificationRepository;

    @Override
    @Transactional(readOnly = true)
    public List<NoticeStatsDTO> getUserEngagementAnalytics(LocalDateTime startDate, LocalDateTime endDate) {
        LocalDateTime start = startDate != null ? startDate : LocalDateTime.now().minusDays(30);
        LocalDateTime end = endDate != null ? endDate : LocalDateTime.now();
        return noticeRepository.getUserEngagementAnalytics(start, end);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentPerformanceDTO> getDepartmentPerformanceAnalysis(LocalDateTime startDate) {
        LocalDateTime start = startDate != null ? startDate : LocalDateTime.now().minusDays(90);
        return noticeRepository.getDepartmentPerformanceAnalysis(start);
    }

    @Override
    @Transactional(readOnly = true)
    public List<CategoryEngagementDTO> getContentCategoryAnalysis(LocalDateTime startDate, LocalDateTime endDate) {
        LocalDateTime start = startDate != null ? startDate : LocalDateTime.now().minusDays(30);
        LocalDateTime end = endDate != null ? endDate : LocalDateTime.now();
        return noticeRepository.getContentCategoryAnalysis(start, end);
    }

    @Override
    @Transactional(readOnly = true)
    public AnalyticsSummaryDTO getAnalyticsSummary() {
        long totalNotices = noticeRepository.count();
        long publishedNotices = noticeRepository.countByStatus(NoticeStatus.PUBLISHED);
        long draftNotices = noticeRepository.countByStatus(NoticeStatus.DRAFT);
        long urgentNotices = noticeRepository.countByPriority(Priority.URGENT);
        long totalViews = noticeRepository.sumReadCount();
        long totalLikes = notificationRepository.sumLikes();
        long totalUsers = userRepository.count();
        long totalDepartments = departmentRepository.count();
        long totalCategories = categoryRepository.count();

        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        List<DepartmentPerformanceDTO> departmentStats = getDepartmentPerformanceAnalysis(thirtyDaysAgo);
        List<CategoryEngagementDTO> categoryStats = getContentCategoryAnalysis(thirtyDaysAgo, LocalDateTime.now());
        List<NoticeStatsDTO> topNotices = getUserEngagementAnalytics(thirtyDaysAgo, LocalDateTime.now());

        return AnalyticsSummaryDTO.builder()
                .totalNotices(totalNotices)
                .publishedNotices(publishedNotices)
                .draftNotices(draftNotices)
                .urgentNotices(urgentNotices)
                .totalViews(totalViews)
                .totalLikes(totalLikes)
                .totalUsers(totalUsers)
                .totalDepartments(totalDepartments)
                .totalCategories(totalCategories)
                .departmentStats(departmentStats)
                .categoryStats(categoryStats)
                .topNotices(topNotices)
                .build();
    }
}
