package com.school.noticeboard.repository;

import com.school.noticeboard.dto.response.CategoryEngagementDTO;
import com.school.noticeboard.dto.response.DepartmentPerformanceDTO;
import com.school.noticeboard.dto.response.NoticeStatsDTO;
import com.school.noticeboard.entity.Notice;
import com.school.noticeboard.enums.NoticeStatus;
import com.school.noticeboard.enums.Priority;
import com.school.noticeboard.enums.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Long> {

    // SRS Active Notices Query for specific Role & Department
    @Query("SELECT n FROM Notice n " +
           "LEFT JOIN n.author a " +
           "LEFT JOIN n.category c " +
           "LEFT JOIN n.department d " +
           "WHERE n.status = com.school.noticeboard.enums.NoticeStatus.PUBLISHED " +
           "AND (n.expiryDate IS NULL OR n.expiryDate >= CURRENT_TIMESTAMP) " +
           "AND (n.audienceType = com.school.noticeboard.enums.AudienceType.PUBLIC OR :userRole MEMBER OF n.targetRoles) " +
           "AND (:departmentId IS NULL OR (d IS NOT NULL AND d.id = :departmentId)) " +
           "ORDER BY n.isPinned DESC, n.priority DESC, n.publishDate DESC")
    Page<Notice> findActiveNoticesForRole(@Param("userRole") Role userRole,
                                         @Param("departmentId") Long departmentId,
                                         Pageable pageable);

    // SRS Public Notices Query
    @Query("SELECT n FROM Notice n " +
           "LEFT JOIN n.author a " +
           "LEFT JOIN n.category c " +
           "LEFT JOIN n.department d " +
           "WHERE n.status = com.school.noticeboard.enums.NoticeStatus.PUBLISHED " +
           "AND (n.expiryDate IS NULL OR n.expiryDate >= CURRENT_TIMESTAMP) " +
           "AND n.audienceType = com.school.noticeboard.enums.AudienceType.PUBLIC " +
           "AND (:departmentId IS NULL OR (d IS NOT NULL AND d.id = :departmentId)) " +
           "AND (:categoryId IS NULL OR (c IS NOT NULL AND c.id = :categoryId)) " +
           "ORDER BY n.isPinned DESC, n.priority DESC, n.publishDate DESC")
    Page<Notice> findPublicActiveNotices(@Param("departmentId") Long departmentId,
                                        @Param("categoryId") Long categoryId,
                                        Pageable pageable);

    // SRS Author Notice Statistics
    @Query("SELECT NEW com.school.noticeboard.dto.response.NoticeStatsDTO(n.id, n.title, " +
           "COUNT(un.id), " +
           "SUM(CASE WHEN un.readStatus = com.school.noticeboard.enums.ReadStatus.READ THEN 1L ELSE 0L END)) " +
           "FROM Notice n LEFT JOIN UserNotification un ON n.id = un.notice.id " +
           "WHERE n.author.id = :authorId " +
           "GROUP BY n.id, n.title")
    List<NoticeStatsDTO> getAuthorNoticeStatistics(@Param("authorId") Long authorId);

    // SRS User Engagement Analytics
    @Query("SELECT NEW com.school.noticeboard.dto.response.NoticeStatsDTO(n.id, n.title, " +
           "COUNT(un.id), " +
           "SUM(CASE WHEN un.readStatus = com.school.noticeboard.enums.ReadStatus.READ THEN 1L ELSE 0L END), " +
           "AVG(CASE WHEN un.engagementType = com.school.noticeboard.enums.EngagementType.LIKE THEN 1.0 ELSE 0.0 END)) " +
           "FROM Notice n " +
           "LEFT JOIN UserNotification un ON n.id = un.notice.id " +
           "WHERE n.createdDate BETWEEN :startDate AND :endDate " +
           "GROUP BY n.id, n.title " +
           "ORDER BY SUM(CASE WHEN un.readStatus = com.school.noticeboard.enums.ReadStatus.READ THEN 1L ELSE 0L END) DESC")
    List<NoticeStatsDTO> getUserEngagementAnalytics(@Param("startDate") LocalDateTime startDate,
                                                   @Param("endDate") LocalDateTime endDate);

    // SRS Department Performance Analysis
    @Query("SELECT NEW com.school.noticeboard.dto.response.DepartmentPerformanceDTO(d.departmentName, " +
           "COUNT(n), " +
           "AVG(n.readCount), " +
           "SUM(CASE WHEN n.priority = com.school.noticeboard.enums.Priority.URGENT THEN 1L ELSE 0L END)) " +
           "FROM Department d " +
           "LEFT JOIN Notice n ON d.id = n.department.id " +
           "WHERE n.createdDate >= :startDate " +
           "GROUP BY d.id, d.departmentName " +
           "HAVING COUNT(n) > 0 " +
           "ORDER BY AVG(n.readCount) DESC")
    List<DepartmentPerformanceDTO> getDepartmentPerformanceAnalysis(@Param("startDate") LocalDateTime startDate);

    // SRS Content Category Analysis
    @Query("SELECT NEW com.school.noticeboard.dto.response.CategoryEngagementDTO(c.categoryName, " +
           "COUNT(n), " +
           "AVG(n.engagementScore), " +
           "MAX(n.readCount)) " +
           "FROM Category c " +
           "JOIN Notice n ON c.id = n.category.id " +
           "WHERE n.status = com.school.noticeboard.enums.NoticeStatus.PUBLISHED " +
           "AND n.publishDate BETWEEN :startDate AND :endDate " +
           "GROUP BY c.id, c.categoryName " +
           "ORDER BY AVG(n.engagementScore) DESC")
    List<CategoryEngagementDTO> getContentCategoryAnalysis(@Param("startDate") LocalDateTime startDate,
                                                          @Param("endDate") LocalDateTime endDate);

    // Flexible Search & Filter query
    @Query("SELECT n FROM Notice n WHERE " +
           "(:keyword IS NULL OR LOWER(n.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(n.content) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:categoryId IS NULL OR n.category.id = :categoryId) " +
           "AND (:departmentId IS NULL OR n.department.id = :departmentId) " +
           "AND (:status IS NULL OR n.status = :status)")
    Page<Notice> searchNotices(@Param("keyword") String keyword,
                               @Param("categoryId") Long categoryId,
                               @Param("departmentId") Long departmentId,
                               @Param("status") NoticeStatus status,
                               Pageable pageable);

    List<Notice> findByAuthorId(Long authorId);

    long countByStatus(NoticeStatus status);

    long countByPriority(Priority priority);

    @Query("SELECT COALESCE(SUM(n.readCount), 0) FROM Notice n")
    long sumReadCount();
}
