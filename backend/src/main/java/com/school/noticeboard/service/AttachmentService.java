package com.school.noticeboard.service;

import com.school.noticeboard.dto.response.AttachmentDTO;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface AttachmentService {
    AttachmentDTO uploadAttachment(Long noticeId, MultipartFile file, String username);
    Resource loadFileAsResource(Long attachmentId);
    AttachmentDTO getAttachmentById(Long attachmentId);
    List<AttachmentDTO> getAttachmentsByNoticeId(Long noticeId);
    void deleteAttachment(Long attachmentId, String username, boolean isAdmin);
}
