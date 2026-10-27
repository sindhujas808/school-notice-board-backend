package com.school.noticeboard.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttachmentDTO {
    private Long id;
    private Long noticeId;
    private String fileName;
    private String originalFileName;
    private String fileType;
    private Long fileSize;
    private LocalDateTime uploadTime;
}
