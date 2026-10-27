package com.school.noticeboard.service;

import com.school.noticeboard.dto.response.AuditLogDTO;
import com.school.noticeboard.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface AuditLogService {
    void log(User user, String action, String entityName, Long entityId, String description, String ipAddress);
    void log(String username, String action, String entityName, Long entityId, String description, String ipAddress);
    Page<AuditLogDTO> getAllAuditLogs(Pageable pageable);
    List<AuditLogDTO> getRecentAuditLogs();
}
