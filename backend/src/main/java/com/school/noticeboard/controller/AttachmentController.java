package com.school.noticeboard.controller;

import com.school.noticeboard.dto.response.ApiResponse;
import com.school.noticeboard.dto.response.AttachmentDTO;
import com.school.noticeboard.service.AttachmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
public class AttachmentController {

    private final AttachmentService attachmentService;

    @PostMapping("/upload/{noticeId}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<ApiResponse<AttachmentDTO>> uploadFile(
            @PathVariable Long noticeId,
            @RequestParam("file") MultipartFile file,
            Authentication auth) {
        AttachmentDTO dto = attachmentService.uploadAttachment(noticeId, file, auth.getName());
        return new ResponseEntity<>(ApiResponse.success("File uploaded successfully", dto), HttpStatus.CREATED);
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id) {
        Resource resource = attachmentService.loadFileAsResource(id);
        AttachmentDTO dto = attachmentService.getAttachmentById(id);

        String contentType = dto.getFileType() != null ? dto.getFileType() : MediaType.APPLICATION_OCTET_STREAM_VALUE;

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + dto.getOriginalFileName() + "\"")
                .body(resource);
    }

    @GetMapping("/notice/{noticeId}")
    public ResponseEntity<ApiResponse<List<AttachmentDTO>>> getNoticeAttachments(@PathVariable Long noticeId) {
        List<AttachmentDTO> list = attachmentService.getAttachmentsByNoticeId(noticeId);
        return ResponseEntity.ok(ApiResponse.success("Attachments retrieved", list));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteAttachment(@PathVariable Long id, Authentication auth) {
        boolean isAdmin = auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        attachmentService.deleteAttachment(id, auth.getName(), isAdmin);
        return ResponseEntity.ok(ApiResponse.success("Attachment deleted successfully", null));
    }
}
