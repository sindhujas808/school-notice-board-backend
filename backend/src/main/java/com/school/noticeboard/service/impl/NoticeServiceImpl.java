package com.school.noticeboard.service.impl;

import com.school.noticeboard.dto.request.NoticeCreateRequest;
import com.school.noticeboard.dto.request.NoticeUpdateRequest;
import com.school.noticeboard.dto.response.AttachmentDTO;
import com.school.noticeboard.dto.response.NoticeDTO;
import com.school.noticeboard.entity.Category;
import com.school.noticeboard.entity.Department;
import com.school.noticeboard.entity.Notice;
import com.school.noticeboard.entity.User;
import com.school.noticeboard.enums.AudienceType;
import com.school.noticeboard.enums.EngagementType;
import com.school.noticeboard.enums.NoticeStatus;
import com.school.noticeboard.enums.Role;
import com.school.noticeboard.exception.ResourceNotFoundException;
import com.school.noticeboard.exception.UnauthorizedException;
import com.school.noticeboard.repository.*;
import com.school.noticeboard.service.AuditLogService;
import com.school.noticeboard.service.NoticeService;
import com.school.noticeboard.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class NoticeServiceImpl implements NoticeService {

    private final NoticeRepository noticeRepository;
    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final DepartmentRepository departmentRepository;
    private final UserNotificationRepository notificationRepository;
    private final CommentRepository commentRepository;
    private final AttachmentRepository attachmentRepository;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    @Override
    @Transactional
    public NoticeDTO createNotice(NoticeCreateRequest request, String username) {
        User author = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        // Category resolution
        Category category = null;
        if (request.getCategoryId() != null) {
            category = categoryRepository.findById(request.getCategoryId())
                    .orElse(null);
        }
        if (category == null && request.getCategoryName() != null && !request.getCategoryName().trim().isEmpty()) {
            category = categoryRepository.findByCategoryName(request.getCategoryName().trim())
                    .orElseGet(() -> categoryRepository.save(Category.builder()
                            .categoryName(request.getCategoryName().trim())
                            .colorCode("#3b82f6")
                            .description("Auto-created category")
                            .build()));
        }
        if (category == null) {
            category = categoryRepository.findAll().stream().findFirst()
                    .orElseGet(() -> categoryRepository.save(Category.builder()
                            .categoryName("General")
                            .colorCode("#3b82f6")
                            .description("General Announcements")
                            .build()));
        }

        // Department resolution
        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId()).orElse(null);
        } else if (author.getDepartment() != null) {
            department = author.getDepartment();
        }

        LocalDateTime publishDate = request.getPublishDate() != null ? request.getPublishDate() : LocalDateTime.now();

        Set<Role> targetRoles = request.getTargetRoles() != null ? request.getTargetRoles() : new HashSet<>();
        if (targetRoles.isEmpty() && request.getAudienceType() == AudienceType.ROLE_BASED) {
            targetRoles.add(Role.STUDENT);
            targetRoles.add(Role.PARENT);
            targetRoles.add(Role.TEACHER);
        }

        Notice notice = Notice.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .author(author)
                .category(category)
                .department(department)
                .status(request.getStatus() != null ? request.getStatus() : NoticeStatus.PUBLISHED)
                .priority(request.getPriority() != null ? request.getPriority() : com.school.noticeboard.enums.Priority.MEDIUM)
                .audienceType(request.getAudienceType() != null ? request.getAudienceType() : AudienceType.PUBLIC)
                .targetRoles(targetRoles)
                .publishDate(publishDate)
                .expiryDate(request.getExpiryDate())
                .isPinned(request.isPinned())
                .readCount(0L)
                .engagementScore(0.0)
                .build();

        Notice savedNotice = noticeRepository.save(notice);

        auditLogService.log(author, "NOTICE_CREATED", "NOTICE", savedNotice.getId(), "Created notice: " + savedNotice.getTitle(), null);

        // Notify target users if published
        if (savedNotice.getStatus() == NoticeStatus.PUBLISHED) {
            try {
                notificationService.createNotificationsForNotice(savedNotice);
            } catch (Exception e) {
                log.error("Failed to generate notifications for notice {}: {}", savedNotice.getId(), e.getMessage());
            }
        }

        return mapToDTO(savedNotice);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NoticeDTO> getNoticesForUser(String username, Long categoryId, Long departmentId, Pageable pageable) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        if (user.getRole() == Role.ADMIN) {
            return noticeRepository.searchNotices(null, categoryId, departmentId, null, pageable)
                    .map(this::mapToDTO);
        }

        return noticeRepository.findActiveNoticesForRole(user.getRole(), departmentId, pageable)
                .map(this::mapToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NoticeDTO> getPublicNotices(Long categoryId, Long departmentId, Pageable pageable) {
        return noticeRepository.findPublicActiveNotices(departmentId, categoryId, pageable)
                .map(this::mapToDTO);
    }

    @Override
    @Transactional
    public NoticeDTO getNoticeById(Long id, boolean incrementReadCount) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notice not found with id: " + id));

        if (incrementReadCount) {
            notice.setReadCount(notice.getReadCount() + 1);
            notice = noticeRepository.save(notice);
        }

        return mapToDTO(notice);
    }

    @Override
    @Transactional
    public NoticeDTO updateNotice(Long id, NoticeUpdateRequest request, String username, boolean isAdmin) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notice not found with id: " + id));

        if (!isAdmin && !notice.getAuthor().getUsername().equals(username)) {
            throw new UnauthorizedException("You are not authorized to update this notice");
        }

        if (request.getTitle() != null && !request.getTitle().trim().isEmpty()) {
            notice.setTitle(request.getTitle());
        }
        if (request.getContent() != null && !request.getContent().trim().isEmpty()) {
            notice.setContent(request.getContent());
        }
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + request.getCategoryId()));
            notice.setCategory(category);
        } else if (request.getCategoryName() != null && !request.getCategoryName().trim().isEmpty()) {
            Category category = categoryRepository.findByCategoryName(request.getCategoryName().trim())
                    .orElseGet(() -> categoryRepository.save(Category.builder()
                            .categoryName(request.getCategoryName().trim())
                            .colorCode("#3b82f6")
                            .description("Auto-created category")
                            .build()));
            notice.setCategory(category);
        }
        if (request.getDepartmentId() != null) {
            Department department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + request.getDepartmentId()));
            notice.setDepartment(department);
        }
        if (request.getPriority() != null) {
            notice.setPriority(request.getPriority());
        }
        if (request.getAudienceType() != null) {
            notice.setAudienceType(request.getAudienceType());
        }
        if (request.getTargetRoles() != null) {
            notice.setTargetRoles(request.getTargetRoles());
        }
        if (request.getPublishDate() != null) {
            notice.setPublishDate(request.getPublishDate());
        }
        if (request.getExpiryDate() != null) {
            notice.setExpiryDate(request.getExpiryDate());
        }
        if (request.getStatus() != null) {
            notice.setStatus(request.getStatus());
        }
        if (request.getIsPinned() != null) {
            notice.setPinned(request.getIsPinned());
        }

        Notice updated = noticeRepository.save(notice);

        auditLogService.log(username, "NOTICE_UPDATED", "NOTICE", updated.getId(), "Updated notice: " + updated.getTitle(), null);

        return mapToDTO(updated);
    }

    @Override
    @Transactional
    public void deleteNotice(Long id, String username, boolean isAdmin) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notice not found with id: " + id));

        if (!isAdmin && !notice.getAuthor().getUsername().equals(username)) {
            throw new UnauthorizedException("You are not authorized to delete this notice");
        }

        notificationRepository.deleteByNoticeId(id);
        commentRepository.deleteByNoticeId(id);
        attachmentRepository.deleteByNoticeId(id);

        noticeRepository.delete(notice);

        auditLogService.log(username, "NOTICE_DELETED", "NOTICE", id, "Deleted notice: " + notice.getTitle(), null);
    }

    @Override
    @Transactional
    public NoticeDTO publishNotice(Long id, String username, boolean isAdmin) {
        Notice notice = noticeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notice not found with id: " + id));

        if (!isAdmin && !notice.getAuthor().getUsername().equals(username)) {
            throw new UnauthorizedException("You are not authorized to publish this notice");
        }

        notice.setStatus(NoticeStatus.PUBLISHED);
        notice.setPublishDate(LocalDateTime.now());
        Notice published = noticeRepository.save(notice);

        notificationService.createNotificationsForNotice(published);

        auditLogService.log(username, "NOTICE_PUBLISHED", "NOTICE", id, "Published notice: " + notice.getTitle(), null);

        return mapToDTO(published);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NoticeDTO> searchNotices(String keyword, Long categoryId, Long departmentId, NoticeStatus status, Pageable pageable) {
        return noticeRepository.searchNotices(keyword, categoryId, departmentId, status, pageable)
                .map(this::mapToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<NoticeDTO> getNoticesByAuthor(Long authorId) {
        return noticeRepository.findByAuthorId(authorId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<NoticeDTO> getNoticesWithDynamicSorting(String userRole,
                                                        List<String> sortFields,
                                                        List<String> sortDirections,
                                                        Pageable pageable) {
        List<Sort.Order> orders = new ArrayList<>();
        if (sortFields != null && !sortFields.isEmpty()) {
            for (int i = 0; i < sortFields.size(); i++) {
                String field = sortFields.get(i);
                String direction = (sortDirections != null && i < sortDirections.size()) ?
                        sortDirections.get(i) : "asc";
                orders.add(new Sort.Order(
                        Sort.Direction.fromString(direction), field));
            }
        } else {
            orders.add(new Sort.Order(Sort.Direction.DESC, "publishDate"));
        }

        Sort sort = Sort.by(orders);
        Pageable sortedPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                sort);

        Role role = Role.valueOf(userRole);
        return noticeRepository.findActiveNoticesForRole(role, null, sortedPageable)
                .map(this::mapToDTO);
    }

    private NoticeDTO mapToDTO(Notice n) {
        List<AttachmentDTO> attachments = n.getAttachments() != null ? n.getAttachments().stream()
                .map(att -> AttachmentDTO.builder()
                        .id(att.getId())
                        .noticeId(n.getId())
                        .fileName(att.getFileName())
                        .originalFileName(att.getOriginalFileName())
                        .fileType(att.getFileType())
                        .fileSize(att.getFileSize())
                        .uploadTime(att.getUploadTime())
                        .build())
                .collect(Collectors.toList()) : new ArrayList<>();

        long likeCount = 0;
        try {
            likeCount = notificationRepository.countByNoticeIdAndEngagementType(n.getId(), EngagementType.LIKE);
        } catch (Exception ignored) {}

        return NoticeDTO.builder()
                .id(n.getId())
                .title(n.getTitle())
                .content(n.getContent())
                .authorId(n.getAuthor() != null ? n.getAuthor().getId() : null)
                .authorName(n.getAuthor() != null ? n.getAuthor().getFullName() : "Anonymous")
                .authorRole(n.getAuthor() != null ? n.getAuthor().getRole().name() : "")
                .categoryId(n.getCategory() != null ? n.getCategory().getId() : null)
                .categoryName(n.getCategory() != null ? n.getCategory().getCategoryName() : "General")
                .categoryColor(n.getCategory() != null ? n.getCategory().getColorCode() : "#3b82f6")
                .departmentId(n.getDepartment() != null ? n.getDepartment().getId() : null)
                .departmentName(n.getDepartment() != null ? n.getDepartment().getDepartmentName() : "All")
                .status(n.getStatus())
                .priority(n.getPriority())
                .audienceType(n.getAudienceType())
                .targetRoles(n.getTargetRoles())
                .publishDate(n.getPublishDate())
                .expiryDate(n.getExpiryDate())
                .readCount(n.getReadCount())
                .engagementScore(n.getEngagementScore())
                .isPinned(n.isPinned())
                .createdDate(n.getCreatedDate())
                .updatedDate(n.getUpdatedDate())
                .attachments(attachments)
                .commentCount(n.getComments() != null ? n.getComments().size() : 0)
                .likeCount(likeCount)
                .build();
    }
}
