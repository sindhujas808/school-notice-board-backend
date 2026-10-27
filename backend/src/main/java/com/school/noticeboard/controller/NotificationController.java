package com.school.noticeboard.controller;

import com.school.noticeboard.dto.request.EngagementRequest;
import com.school.noticeboard.dto.response.ApiResponse;
import com.school.noticeboard.dto.response.NotificationDTO;
import com.school.noticeboard.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationDTO>>> getAllNotifications(Authentication auth) {
        List<NotificationDTO> list = notificationService.getAllUserNotifications(auth.getName());
        return ResponseEntity.ok(ApiResponse.success("Notifications retrieved", list));
    }

    @GetMapping("/paged")
    public ResponseEntity<Page<NotificationDTO>> getNotificationsPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication auth) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return ResponseEntity.ok(notificationService.getUserNotifications(auth.getName(), pageable));
    }

    @GetMapping("/unread-count")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getUnreadCount(Authentication auth) {
        long count = notificationService.getUnreadCount(auth.getName());
        Map<String, Long> map = new HashMap<>();
        map.put("unreadCount", count);
        return ResponseEntity.ok(ApiResponse.success("Unread count retrieved", map));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<NotificationDTO>> markAsRead(@PathVariable Long id, Authentication auth) {
        NotificationDTO dto = notificationService.markAsRead(id, auth.getName());
        return ResponseEntity.ok(ApiResponse.success("Notification marked as read", dto));
    }

    @PatchMapping("/read-all")
    public ResponseEntity<ApiResponse<Void>> markAllAsRead(Authentication auth) {
        notificationService.markAllAsRead(auth.getName());
        return ResponseEntity.ok(ApiResponse.success("All notifications marked as read", null));
    }

    @PostMapping("/engage")
    public ResponseEntity<ApiResponse<Void>> recordEngagement(
            @Valid @RequestBody EngagementRequest request,
            Authentication auth) {
        notificationService.recordEngagement(auth.getName(), request);
        return ResponseEntity.ok(ApiResponse.success("Engagement recorded successfully", null));
    }
}
