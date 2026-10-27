package com.school.noticeboard.repository;

import com.school.noticeboard.entity.UserNotification;
import com.school.noticeboard.enums.EngagementType;
import com.school.noticeboard.enums.ReadStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserNotificationRepository extends JpaRepository<UserNotification, Long> {

    List<UserNotification> findByUserIdOrderByCreatedAtDesc(Long userId);

    Page<UserNotification> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    long countByUserIdAndReadStatus(Long userId, ReadStatus readStatus);

    Optional<UserNotification> findByUserIdAndNoticeId(Long userId, Long noticeId);

    long countByNoticeIdAndEngagementType(Long noticeId, EngagementType engagementType);

    @Query("SELECT COUNT(un) FROM UserNotification un WHERE un.engagementType = com.school.noticeboard.enums.EngagementType.LIKE")
    long sumLikes();

    void deleteByNoticeId(Long noticeId);

    @org.springframework.data.jpa.repository.Modifying
    @Query("DELETE FROM UserNotification un WHERE un.user.id = :userId")
    void deleteByUserId(@Param("userId") Long userId);
}
