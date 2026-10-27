package com.school.noticeboard.service;

import com.school.noticeboard.dto.request.NoticeCreateRequest;
import com.school.noticeboard.dto.request.NoticeUpdateRequest;
import com.school.noticeboard.dto.response.NoticeDTO;
import com.school.noticeboard.enums.NoticeStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface NoticeService {
    NoticeDTO createNotice(NoticeCreateRequest request, String username);
    Page<NoticeDTO> getNoticesForUser(String username, Long categoryId, Long departmentId, Pageable pageable);
    Page<NoticeDTO> getPublicNotices(Long categoryId, Long departmentId, Pageable pageable);
    NoticeDTO getNoticeById(Long id, boolean incrementReadCount);
    NoticeDTO updateNotice(Long id, NoticeUpdateRequest request, String username, boolean isAdmin);
    void deleteNotice(Long id, String username, boolean isAdmin);
    NoticeDTO publishNotice(Long id, String username, boolean isAdmin);
    Page<NoticeDTO> searchNotices(String keyword, Long categoryId, Long departmentId, NoticeStatus status, Pageable pageable);
    List<NoticeDTO> getNoticesByAuthor(Long authorId);
    Page<NoticeDTO> getNoticesWithDynamicSorting(String userRole, List<String> sortFields, List<String> sortDirections, Pageable pageable);
}
