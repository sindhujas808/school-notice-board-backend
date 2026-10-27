package com.school.noticeboard;

import com.school.noticeboard.dto.response.CategoryEngagementDTO;
import com.school.noticeboard.dto.response.DepartmentPerformanceDTO;
import com.school.noticeboard.dto.response.NoticeStatsDTO;
import com.school.noticeboard.entity.*;
import com.school.noticeboard.enums.*;
import com.school.noticeboard.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
public class NoticeRepositoryJPQLTest {

    @Autowired
    private NoticeRepository noticeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private UserNotificationRepository notificationRepository;

    private User teacher;
    private Department dept;
    private Category cat;

    @BeforeEach
    void setUp() {
        dept = departmentRepository.save(Department.builder()
                .departmentName("Computer Science")
                .code("CS")
                .description("CS Dept")
                .build());

        cat = categoryRepository.save(Category.builder()
                .categoryName("Academics")
                .colorCode("#3b82f6")
                .build());

        teacher = userRepository.save(User.builder()
                .username("teacher1")
                .email("teacher1@school.edu")
                .password("password")
                .fullName("Teacher One")
                .role(Role.TEACHER)
                .department(dept)
                .build());

        Set<Role> targetRoles = new HashSet<>();
        targetRoles.add(Role.STUDENT);

        Notice notice = noticeRepository.save(Notice.builder()
                .title("Mid-term exam circular")
                .content("Details of exams")
                .author(teacher)
                .category(cat)
                .department(dept)
                .status(NoticeStatus.PUBLISHED)
                .priority(Priority.URGENT)
                .audienceType(AudienceType.ROLE_BASED)
                .targetRoles(targetRoles)
                .publishDate(LocalDateTime.now().minusHours(1))
                .expiryDate(LocalDateTime.now().plusDays(10))
                .readCount(20L)
                .engagementScore(5.0)
                .build());

        User student = userRepository.save(User.builder()
                .username("student1")
                .email("student1@school.edu")
                .password("password")
                .fullName("Student One")
                .role(Role.STUDENT)
                .build());

        notificationRepository.save(UserNotification.builder()
                .user(student)
                .notice(notice)
                .title("Exam circular")
                .readStatus(ReadStatus.READ)
                .engagementType(EngagementType.LIKE)
                .build());
    }

    @Test
    void testFindActiveNoticesForRole_ReturnsMatchingNotices() {
        Page<Notice> result = noticeRepository.findActiveNoticesForRole(Role.STUDENT, null, PageRequest.of(0, 10));
        assertNotNull(result);
        assertEquals(1, result.getTotalElements());
        assertEquals("Mid-term exam circular", result.getContent().get(0).getTitle());
    }

    @Test
    void testDepartmentPerformanceAnalysis_ReturnsValidDTO() {
        List<DepartmentPerformanceDTO> list = noticeRepository.getDepartmentPerformanceAnalysis(LocalDateTime.now().minusDays(10));
        assertNotNull(list);
        assertFalse(list.isEmpty());
        assertEquals("Computer Science", list.get(0).getDepartmentName());
        assertEquals(1, list.get(0).getTotalNotices());
        assertEquals(1, list.get(0).getUrgentNotices());
    }

    @Test
    void testContentCategoryAnalysis_ReturnsEngagementStats() {
        List<CategoryEngagementDTO> list = noticeRepository.getContentCategoryAnalysis(
                LocalDateTime.now().minusDays(10), LocalDateTime.now().plusDays(1));
        assertNotNull(list);
        assertFalse(list.isEmpty());
        assertEquals("Academics", list.get(0).getCategoryName());
        assertEquals(1, list.get(0).getNoticeCount());
    }

    @Test
    void testUserEngagementAnalytics_ReturnsCorrectCounts() {
        List<NoticeStatsDTO> list = noticeRepository.getUserEngagementAnalytics(
                LocalDateTime.now().minusDays(10), LocalDateTime.now().plusDays(1));
        assertNotNull(list);
        assertFalse(list.isEmpty());
        assertEquals("Mid-term exam circular", list.get(0).getTitle());
        assertEquals(1, list.get(0).getReadCount());
    }
}
