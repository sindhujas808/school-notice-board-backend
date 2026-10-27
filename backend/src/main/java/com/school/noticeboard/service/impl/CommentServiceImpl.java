package com.school.noticeboard.service.impl;

import com.school.noticeboard.dto.request.CommentRequest;
import com.school.noticeboard.dto.response.CommentDTO;
import com.school.noticeboard.entity.Comment;
import com.school.noticeboard.entity.Notice;
import com.school.noticeboard.entity.User;
import com.school.noticeboard.exception.ResourceNotFoundException;
import com.school.noticeboard.exception.UnauthorizedException;
import com.school.noticeboard.repository.CommentRepository;
import com.school.noticeboard.repository.NoticeRepository;
import com.school.noticeboard.repository.UserRepository;
import com.school.noticeboard.service.AuditLogService;
import com.school.noticeboard.service.CommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final NoticeRepository noticeRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    @Override
    @Transactional(readOnly = true)
    public List<CommentDTO> getCommentsByNoticeId(Long noticeId) {
        return commentRepository.findByNoticeIdOrderByCreatedAtAsc(noticeId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CommentDTO addComment(Long noticeId, CommentRequest request, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        Notice notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new ResourceNotFoundException("Notice not found with id: " + noticeId));

        Comment comment = Comment.builder()
                .notice(notice)
                .user(user)
                .content(request.getContent())
                .build();

        Comment saved = commentRepository.save(comment);

        auditLogService.log(user, "COMMENT_ADDED", "NOTICE", noticeId, "Comment added on notice: " + notice.getTitle(), null);

        return mapToDTO(saved);
    }

    @Override
    @Transactional
    public void deleteComment(Long commentId, String username, boolean isAdmin) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found with id: " + commentId));

        if (!isAdmin && !comment.getUser().getUsername().equals(username)) {
            throw new UnauthorizedException("You are not authorized to delete this comment");
        }

        commentRepository.delete(comment);
        auditLogService.log(username, "COMMENT_DELETED", "COMMENT", commentId, "Comment deleted", null);
    }

    private CommentDTO mapToDTO(Comment c) {
        return CommentDTO.builder()
                .id(c.getId())
                .noticeId(c.getNotice().getId())
                .userId(c.getUser().getId())
                .username(c.getUser().getUsername())
                .userFullName(c.getUser().getFullName())
                .userRole(c.getUser().getRole().name())
                .content(c.getContent())
                .createdAt(c.getCreatedAt())
                .updatedAt(c.getUpdatedAt())
                .build();
    }
}
