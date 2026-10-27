package com.school.noticeboard.controller;

import com.school.noticeboard.dto.request.CommentRequest;
import com.school.noticeboard.dto.response.ApiResponse;
import com.school.noticeboard.dto.response.CommentDTO;
import com.school.noticeboard.service.CommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CommentController {

    private final CommentService commentService;

    @GetMapping("/notices/{noticeId}/comments")
    public ResponseEntity<ApiResponse<List<CommentDTO>>> getComments(@PathVariable Long noticeId) {
        List<CommentDTO> comments = commentService.getCommentsByNoticeId(noticeId);
        return ResponseEntity.ok(ApiResponse.success("Comments retrieved", comments));
    }

    @PostMapping("/notices/{noticeId}/comments")
    public ResponseEntity<ApiResponse<CommentDTO>> addComment(
            @PathVariable Long noticeId,
            @Valid @RequestBody CommentRequest request,
            Authentication auth) {
        CommentDTO comment = commentService.addComment(noticeId, request, auth.getName());
        return new ResponseEntity<>(ApiResponse.success("Comment added successfully", comment), HttpStatus.CREATED);
    }

    @DeleteMapping("/comments/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteComment(
            @PathVariable Long id,
            Authentication auth) {
        boolean isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        commentService.deleteComment(id, auth.getName(), isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Comment deleted successfully", null));
    }
}
