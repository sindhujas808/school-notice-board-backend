package com.school.noticeboard.controller;

import com.school.noticeboard.dto.response.*;
import com.school.noticeboard.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
@PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/summary")
    public ResponseEntity<ApiResponse<AnalyticsSummaryDTO>> getAnalyticsSummary() {
        AnalyticsSummaryDTO summary = analyticsService.getAnalyticsSummary();
        return ResponseEntity.ok(ApiResponse.success("Analytics summary retrieved", summary));
    }

    @GetMapping("/engagement")
    public ResponseEntity<ApiResponse<List<NoticeStatsDTO>>> getUserEngagementAnalytics(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<NoticeStatsDTO> stats = analyticsService.getUserEngagementAnalytics(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success("User engagement analytics retrieved", stats));
    }

    @GetMapping("/department")
    public ResponseEntity<ApiResponse<List<DepartmentPerformanceDTO>>> getDepartmentPerformanceAnalysis(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate) {
        List<DepartmentPerformanceDTO> stats = analyticsService.getDepartmentPerformanceAnalysis(startDate);
        return ResponseEntity.ok(ApiResponse.success("Department performance analysis retrieved", stats));
    }

    @GetMapping("/category")
    public ResponseEntity<ApiResponse<List<CategoryEngagementDTO>>> getContentCategoryAnalysis(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        List<CategoryEngagementDTO> stats = analyticsService.getContentCategoryAnalysis(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success("Content category analysis retrieved", stats));
    }
}
