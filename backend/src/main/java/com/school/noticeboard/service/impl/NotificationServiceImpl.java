package com.school.noticeboard.service.impl;

import com.school.noticeboard.dto.request.EngagementRequest;
import com.school.noticeboard.dto.response.NotificationDTO;
import com.school.noticeboard.entity.Notice;
import com.school.noticeboard.entity.User;
import com.school.noticeboard.entity.UserNotification;
import com.school.noticeboard.enums.AudienceType;
import com.school.noticeboard.enums.EngagementType;
import com.school.noticeboard.enums.ReadStatus;
import com.school.noticeboard.exception.ResourceNotFoundException;
import com.school.noticeboard.exception.UnauthorizedException;
import com.school.noticeboard.repository.NoticeRepository;
import com.school.noticeboard.repository.UserNotificationRepository;
import com.school.noticeboard.repository.UserRepository;
import com.school.noticeboard.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final UserNotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final NoticeRepository noticeRepository;

    @Override
    @Transactional
    public void createNotificationsForNotice(Notice notice) {
        List<User> targetUsers;

        if (notice.getAudienceType() == AudienceType.PUBLIC) {
            targetUsers = userRepository.findAll();
        } else if (notice.getAudienceType() == AudienceType.ROLE_BASED) {
            if (notice.getTargetRoles() != null && !notice.getTargetRoles().isEmpty()) {
                targetUsers = userRepository.findAll().stream()
                        .filter(u -> notice.getTargetRoles().contains(u.getRole()))
                        .collect(Collectors.toList());
            } else {
                targetUsers = userRepository.findAll();
            }
        } else if (notice.getAudienceType() == AudienceType.DEPARTMENT_ONLY && notice.getDepartment() != null) {
            targetUsers = userRepository.findByDepartmentId(notice.getDepartment().getId());
        } else {
            targetUsers = userRepository.findAll();
        }

        List<UserNotification> notifications = targetUsers.stream()
                .filter(user -> !user.getId().equals(notice.getAuthor().getId())) // Don't notify the author
                .map(user -> {
                    String rawTitle = "New Notice: " + (notice.getTitle() != null ? notice.getTitle() : "Announcement");
                    String safeTitle = rawTitle.length() > 250 ? rawTitle.substring(0, 247) + "..." : rawTitle;
                    String catName = notice.getCategory() != null ? notice.getCategory().getCategoryName() : "General";
                    return UserNotification.builder()
                            .user(user)
                            .notice(notice)
                            .title(safeTitle)
                            .message("Priority: " + notice.getPriority() + " | Category: " + catName)
                            .readStatus(ReadStatus.UNREAD)
                            .engagementType(EngagementType.NONE)
                            .build();
                })
                .collect(Collectors.toList());

        notificationRepository.saveAll(notifications);
        log.info("Created {} notifications for notice ID: {}", notifications.size(), notice.getId());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NotificationDTO> getUserNotifications(String username, Pageable pageable) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId(), pageable)
                .map(this::mapToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NotificationDTO> getAllUserNotifications(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadCount(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        return notificationRepository.countByUserIdAndReadStatus(user.getId(), ReadStatus.UNREAD);
    }

    @Override
    @Transactional
    public NotificationDTO markAsRead(Long notificationId, String username) {
        UserNotification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found with id: " + notificationId));

        if (!notification.getUser().getUsername().equals(username)) {
            throw new UnauthorizedException("You are not authorized to update this notification");
        }

        notification.setReadStatus(ReadStatus.READ);
        notification.setReadAt(LocalDateTime.now());
        if (notification.getEngagementType() == EngagementType.NONE) {
            notification.setEngagementType(EngagementType.READ);
        }

        return mapToDTO(notificationRepository.save(notification));
    }

    @Override
    @Transactional
    public void markAllAsRead(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        List<UserNotification> unread = notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).stream()
                .filter(n -> n.getReadStatus() == ReadStatus.UNREAD)
                .peek(n -> {
                    n.setReadStatus(ReadStatus.READ);
                    n.setReadAt(LocalDateTime.now());
                })
                .collect(Collectors.toList());

        notificationRepository.saveAll(unread);
    }

    @Override
    @Transactional
    public void recordEngagement(String username, EngagementRequest request) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        Notice notice = noticeRepository.findById(request.getNoticeId())
                .orElseThrow(() -> new ResourceNotFoundException("Notice not found with id: " + request.getNoticeId()));

        Optional<UserNotification> existing = notificationRepository.findByUserIdAndNoticeId(user.getId(), notice.getId());

        UserNotification userNotification;
        if (existing.isPresent()) {
            userNotification = existing.get();
            userNotification.setEngagementType(request.getEngagementType());
            if (request.getEngagementType() == EngagementType.READ || request.getEngagementType() == EngagementType.LIKE) {
                userNotification.setReadStatus(ReadStatus.READ);
                userNotification.setReadAt(LocalDateTime.now());
            }
        } else {
            userNotification = UserNotification.builder()
                    .user(user)
                    .notice(notice)
                    .title(notice.getTitle())
                    .readStatus(ReadStatus.READ)
                    .engagementType(request.getEngagementType())
                    .readAt(LocalDateTime.now())
                    .build();
        }

        notificationRepository.save(userNotification);

        // Update notice engagement score
        long likeCount = notificationRepository.countByNoticeIdAndEngagementType(notice.getId(), EngagementType.LIKE);
        notice.setEngagementScore((double) likeCount);
        noticeRepository.save(notice);
    }

    private NotificationDTO mapToDTO(UserNotification n) {
        return NotificationDTO.builder()
                .id(n.getId())
                .noticeId(n.getNotice().getId())
                .noticeTitle(n.getNotice().getTitle())
                .title(n.getTitle())
                .message(n.getMessage())
                .readStatus(n.getReadStatus())
                .engagementType(n.getEngagementType())
                .createdAt(n.getCreatedAt())
                .readAt(n.getReadAt())
                .build();
    }
}
