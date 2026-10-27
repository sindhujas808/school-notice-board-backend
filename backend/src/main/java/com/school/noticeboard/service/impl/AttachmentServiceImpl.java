package com.school.noticeboard.service.impl;

import com.school.noticeboard.dto.response.AttachmentDTO;
import com.school.noticeboard.entity.Attachment;
import com.school.noticeboard.entity.Notice;
import com.school.noticeboard.exception.BadRequestException;
import com.school.noticeboard.exception.ResourceNotFoundException;
import com.school.noticeboard.exception.UnauthorizedException;
import com.school.noticeboard.repository.AttachmentRepository;
import com.school.noticeboard.repository.NoticeRepository;
import com.school.noticeboard.service.AttachmentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AttachmentServiceImpl implements AttachmentService {

    @Value("${file.upload-dir:./uploads}")
    private String uploadDir;

    private final AttachmentRepository attachmentRepository;
    private final NoticeRepository noticeRepository;

    @Override
    @Transactional
    public AttachmentDTO uploadAttachment(Long noticeId, MultipartFile file, String username) {
        Notice notice = noticeRepository.findById(noticeId)
                .orElseThrow(() -> new ResourceNotFoundException("Notice not found with id: " + noticeId));

        if (file.isEmpty()) {
            throw new BadRequestException("Failed to store empty file");
        }

        // Limit size <= 50MB (52,428,800 bytes)
        if (file.getSize() > 52428800) {
            throw new BadRequestException("File size exceeds maximum limit of 50MB");
        }

        String originalFileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        String fileExtension = "";
        if (originalFileName.contains(".")) {
            fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }

        String storedFileName = UUID.randomUUID().toString() + fileExtension;

        try {
            Path targetDirectory = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(targetDirectory);

            Path targetLocation = targetDirectory.resolve(storedFileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            Attachment attachment = Attachment.builder()
                    .notice(notice)
                    .fileName(storedFileName)
                    .originalFileName(originalFileName)
                    .fileType(file.getContentType())
                    .fileSize(file.getSize())
                    .filePath(targetLocation.toString())
                    .build();

            return mapToDTO(attachmentRepository.save(attachment));
        } catch (IOException ex) {
            log.error("Could not store file {}", originalFileName, ex);
            throw new BadRequestException("Could not store file " + originalFileName + ". Please try again!");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Resource loadFileAsResource(Long attachmentId) {
        Attachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Attachment not found with id: " + attachmentId));

        try {
            Path filePath = Paths.get(attachment.getFilePath()).normalize();
            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new ResourceNotFoundException("File not found on disk: " + attachment.getOriginalFileName());
            }
        } catch (MalformedURLException ex) {
            throw new ResourceNotFoundException("File not found: " + attachment.getOriginalFileName());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public AttachmentDTO getAttachmentById(Long attachmentId) {
        Attachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Attachment not found with id: " + attachmentId));
        return mapToDTO(attachment);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AttachmentDTO> getAttachmentsByNoticeId(Long noticeId) {
        return attachmentRepository.findByNoticeId(noticeId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteAttachment(Long attachmentId, String username, boolean isAdmin) {
        Attachment attachment = attachmentRepository.findById(attachmentId)
                .orElseThrow(() -> new ResourceNotFoundException("Attachment not found with id: " + attachmentId));

        if (!isAdmin && !attachment.getNotice().getAuthor().getUsername().equals(username)) {
            throw new UnauthorizedException("You are not authorized to delete this attachment");
        }

        try {
            Path filePath = Paths.get(attachment.getFilePath());
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            log.warn("Could not delete file from disk: {}", attachment.getFilePath());
        }

        attachmentRepository.delete(attachment);
    }

    private AttachmentDTO mapToDTO(Attachment att) {
        return AttachmentDTO.builder()
                .id(att.getId())
                .noticeId(att.getNotice().getId())
                .fileName(att.getFileName())
                .originalFileName(att.getOriginalFileName())
                .fileType(att.getFileType())
                .fileSize(att.getFileSize())
                .uploadTime(att.getUploadTime())
                .build();
    }
}
