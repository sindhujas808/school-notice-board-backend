package com.school.noticeboard.service;

import com.school.noticeboard.dto.request.EngagementRequest;
import com.school.noticeboard.dto.response.NotificationDTO;
import com.school.noticeboard.entity.Notice;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface NotificationService {
    void createNotificationsForNotice(Notice notice);
    Page<NotificationDTO> getUserNotifications(String username, Pageable pageable);
    List<NotificationDTO> getAllUserNotifications(String username);
    long getUnreadCount(String username);
    NotificationDTO markAsRead(Long notificationId, String username);
    void markAllAsRead(String username);
    void recordEngagement(String username, EngagementRequest request);
}
