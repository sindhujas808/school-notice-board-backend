package com.school.noticeboard.controller;

import com.school.noticeboard.dto.request.NoticeCreateRequest;
import com.school.noticeboard.dto.request.NoticeUpdateRequest;
import com.school.noticeboard.dto.response.ApiResponse;
import com.school.noticeboard.dto.response.NoticeDTO;
import com.school.noticeboard.enums.NoticeStatus;
import com.school.noticeboard.service.NoticeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notices")
@RequiredArgsConstructor
public class NoticeController {

    private final NoticeService noticeService;

    // SRS Sorting & Pagination Implementation
    @GetMapping
    public ResponseEntity<Page<NoticeDTO>> getNotices(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "publishDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) Long category,
            @RequestParam(required = false) Long department,
            Authentication auth) {

        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<NoticeDTO> notices = noticeService.getNoticesForUser(
                auth.getName(), category, department, pageable);

        return ResponseEntity.ok(notices);
    }

    @GetMapping("/public")
    public ResponseEntity<Page<NoticeDTO>> getPublicNotices(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "publishDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) Long category,
            @RequestParam(required = false) Long department) {

        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<NoticeDTO> notices = noticeService.getPublicNotices(category, department, pageable);
        return ResponseEntity.ok(notices);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<NoticeDTO>> getNoticeById(@PathVariable Long id) {
        NoticeDTO notice = noticeService.getNoticeById(id, true);
        return ResponseEntity.ok(ApiResponse.success("Notice retrieved successfully", notice));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<ApiResponse<NoticeDTO>> createNotice(
            @Valid @RequestBody NoticeCreateRequest request,
            Authentication auth) {
        NoticeDTO created = noticeService.createNotice(request, auth.getName());
        return new ResponseEntity<>(ApiResponse.success("Notice created successfully", created), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<ApiResponse<NoticeDTO>> updateNotice(
            @PathVariable Long id,
            @RequestBody NoticeUpdateRequest request,
            Authentication auth) {
        boolean isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        NoticeDTO updated = noticeService.updateNotice(id, request, auth.getName(), isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Notice updated successfully", updated));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteNotice(
            @PathVariable Long id,
            Authentication auth) {
        boolean isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        noticeService.deleteNotice(id, auth.getName(), isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Notice deleted successfully", null));
    }

    @PatchMapping("/{id}/publish")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<ApiResponse<NoticeDTO>> publishNotice(
            @PathVariable Long id,
            Authentication auth) {
        boolean isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        NoticeDTO published = noticeService.publishNotice(id, auth.getName(), isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Notice published successfully", published));
    }

    @GetMapping("/search")
    public ResponseEntity<Page<NoticeDTO>> searchNotices(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long departmentId,
            @RequestParam(required = false) NoticeStatus status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(defaultValue = "publishDate") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        Sort sort = Sort.by(Sort.Direction.fromString(sortDir), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);

        Page<NoticeDTO> notices = noticeService.searchNotices(keyword, categoryId, departmentId, status, pageable);
        return ResponseEntity.ok(notices);
    }

    @GetMapping("/author/{authorId}")
    public ResponseEntity<ApiResponse<List<NoticeDTO>>> getNoticesByAuthor(@PathVariable Long authorId) {
        List<NoticeDTO> notices = noticeService.getNoticesByAuthor(authorId);
        return ResponseEntity.ok(ApiResponse.success("Author notices retrieved", notices));
    }
}
