package com.school.noticeboard.repository;

import com.school.noticeboard.entity.Attachment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttachmentRepository extends JpaRepository<Attachment, Long> {
    List<Attachment> findByNoticeId(Long noticeId);
    void deleteByNoticeId(Long noticeId);
}
