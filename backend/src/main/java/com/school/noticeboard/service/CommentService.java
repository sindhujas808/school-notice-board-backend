package com.school.noticeboard.service;

import com.school.noticeboard.dto.request.CommentRequest;
import com.school.noticeboard.dto.response.CommentDTO;

import java.util.List;

public interface CommentService {
    List<CommentDTO> getCommentsByNoticeId(Long noticeId);
    CommentDTO addComment(Long noticeId, CommentRequest request, String username);
    void deleteComment(Long commentId, String username, boolean isAdmin);
}
