package com.school.noticeboard.config;

import com.school.noticeboard.entity.*;
import com.school.noticeboard.enums.*;
import com.school.noticeboard.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final CategoryRepository categoryRepository;
    private final NoticeRepository noticeRepository;
    private final UserNotificationRepository notificationRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        log.info("Checking and seeding database records...");
        seedDepartmentsAndCategories();
        seedUsers();
        if (noticeRepository.count() == 0) {
            seedSampleNotices();
        }
        log.info("Database seeding check completed successfully!");
    }

    private void seedDepartmentsAndCategories() {
        createDepartmentIfMissing("CSE", "Computer Science & Engineering", "Department of Computer Science and Engineering");
        createDepartmentIfMissing("ECE", "Electronics & Communication Engineering", "Department of Electronics and Communication Engineering");
        createDepartmentIfMissing("EEE", "Electrical & Electronics Engineering", "Department of Electrical and Electronics Engineering");
        createDepartmentIfMissing("IT", "Information Technology", "Department of Information Technology");
        createDepartmentIfMissing("AIDS", "Artificial Intelligence & Data Science", "Department of Artificial Intelligence and Data Science");
        createDepartmentIfMissing("ADMIN", "Administration", "Central School Administration");

        createCategoryIfMissing("Academic", "#3b82f6", "Academic timetables, lectures, syllabi, and coursework announcements");
        createCategoryIfMissing("Examinations", "#ef4444", "Exam dates, schedules, hall tickets, and results");
        createCategoryIfMissing("Events & Fest", "#8b5cf6", "College fests, cultural nights, conferences, and seminars");
        createCategoryIfMissing("Sports & Activities", "#10b981", "Inter-college sports tournaments, fitness trials, and athletic clubs");
        createCategoryIfMissing("General Announcements", "#f59e0b", "General school rules, holidays, and campus circulars");
    }

    private void createDepartmentIfMissing(String code, String name, String description) {
        if (departmentRepository.findByCode(code).isEmpty()) {
            departmentRepository.save(Department.builder()
                    .code(code)
                    .departmentName(name)
                    .description(description)
                    .build());
        }
    }

    private void createCategoryIfMissing(String name, String color, String desc) {
        if (categoryRepository.findByCategoryName(name).isEmpty()) {
            categoryRepository.save(Category.builder()
                    .categoryName(name)
                    .colorCode(color)
                    .description(desc)
                    .build());
        }
    }

    private void seedUsers() {
        Department csDept = departmentRepository.findByCode("CSE").orElse(null);
        Department adminDept = departmentRepository.findByCode("ADMIN").orElse(null);

        // Admin
        userRepository.findByUsername("admin").ifPresentOrElse(
                u -> {
                    u.setPassword(passwordEncoder.encode("admin123"));
                    u.setAccountNonLocked(true);
                    u.setFailedAttempts(0);
                    userRepository.save(u);
                },
                () -> userRepository.save(User.builder()
                        .username("admin")
                        .email("admin@school.edu")
                        .password(passwordEncoder.encode("admin123"))
                        .fullName("System Administrator")
                        .role(Role.ADMIN)
                        .department(adminDept)
                        .accountNonLocked(true)
                        .failedAttempts(0)
                        .build())
        );

        // Teacher
        userRepository.findByUsername("teacher").ifPresentOrElse(
                u -> {
                    u.setPassword(passwordEncoder.encode("teacher123"));
                    u.setAccountNonLocked(true);
                    u.setFailedAttempts(0);
                    userRepository.save(u);
                },
                () -> userRepository.save(User.builder()
                        .username("teacher")
                        .email("teacher@school.edu")
                        .password(passwordEncoder.encode("teacher123"))
                        .fullName("Prof. Robert Vance")
                        .role(Role.TEACHER)
                        .department(csDept)
                        .accountNonLocked(true)
                        .failedAttempts(0)
                        .build())
        );

        // Student
        userRepository.findByUsername("student").ifPresentOrElse(
                u -> {
                    u.setPassword(passwordEncoder.encode("student123"));
                    u.setAccountNonLocked(true);
                    u.setFailedAttempts(0);
                    userRepository.save(u);
                },
                () -> userRepository.save(User.builder()
                        .username("student")
                        .email("student@school.edu")
                        .password(passwordEncoder.encode("student123"))
                        .fullName("Sindhuja Patel")
                        .role(Role.STUDENT)
                        .department(csDept)
                        .accountNonLocked(true)
                        .failedAttempts(0)
                        .build())
        );

        // Parent
        userRepository.findByUsername("parent").ifPresentOrElse(
                u -> {
                    u.setPassword(passwordEncoder.encode("parent123"));
                    u.setAccountNonLocked(true);
                    u.setFailedAttempts(0);
                    userRepository.save(u);
                },
                () -> userRepository.save(User.builder()
                        .username("parent")
                        .email("parent@school.edu")
                        .password(passwordEncoder.encode("parent123"))
                        .fullName("Mr. Rajesh Patel")
                        .role(Role.PARENT)
                        .accountNonLocked(true)
                        .failedAttempts(0)
                        .build())
        );
    }

    private void seedSampleNotices() {
        Department csDept = departmentRepository.findByCode("CSE").orElse(null);
        Department adminDept = departmentRepository.findByCode("ADMIN").orElse(null);
        User admin = userRepository.findByUsername("admin").orElse(null);
        User teacher = userRepository.findByUsername("teacher").orElse(null);
        User student = userRepository.findByUsername("student").orElse(null);
        User parent = userRepository.findByUsername("parent").orElse(null);

        Category academic = categoryRepository.findByCategoryName("Academic").orElse(null);
        Category exams = categoryRepository.findByCategoryName("Examinations").orElse(null);
        Category events = categoryRepository.findByCategoryName("Events & Fest").orElse(null);
        Category general = categoryRepository.findByCategoryName("General Announcements").orElse(null);

        Set<Role> allTargetRoles = new HashSet<>();
        allTargetRoles.add(Role.STUDENT);
        allTargetRoles.add(Role.PARENT);
        allTargetRoles.add(Role.TEACHER);

        // Notice 1: Public Event Notice
        Notice n1 = noticeRepository.save(Notice.builder()
                .title("Annual Tech Fest & Innovation Expo 2026")
                .content("We are thrilled to announce the Annual Tech Fest 2026 scheduled for next month. All students and faculty members are invited to submit project prototypes and register for hackathons. Exciting prizes to be won!")
                .author(teacher)
                .category(events)
                .department(csDept)
                .status(NoticeStatus.PUBLISHED)
                .priority(Priority.HIGH)
                .audienceType(AudienceType.PUBLIC)
                .publishDate(LocalDateTime.now().minusDays(2))
                .expiryDate(LocalDateTime.now().plusDays(30))
                .readCount(45L)
                .engagementScore(12.0)
                .isPinned(true)
                .build());

        // Notice 2: Exam Schedule
        Notice n2 = noticeRepository.save(Notice.builder()
                .title("Final Semester Examination Schedule Released")
                .content("The final semester examination timetable for all undergraduate and postgraduate programs has been published. Exams commence on the 15th of next month. Please check the portal for hall ticket download dates.")
                .author(admin)
                .category(exams)
                .department(adminDept)
                .status(NoticeStatus.PUBLISHED)
                .priority(Priority.URGENT)
                .audienceType(AudienceType.ROLE_BASED)
                .targetRoles(allTargetRoles)
                .publishDate(LocalDateTime.now().minusDays(1))
                .expiryDate(LocalDateTime.now().plusDays(45))
                .readCount(88L)
                .engagementScore(25.0)
                .isPinned(true)
                .build());

        // Notice 3: Academic Circular
        Notice n3 = noticeRepository.save(Notice.builder()
                .title("AI & Cloud Computing Departmental Workshop")
                .content("The Department of Computer Science & Engineering is organizing a 3-day hands-on workshop covering Deep Learning, Distributed Systems, and Cloud Native Deployments with industry leaders.")
                .author(teacher)
                .category(academic)
                .department(csDept)
                .status(NoticeStatus.PUBLISHED)
                .priority(Priority.MEDIUM)
                .audienceType(AudienceType.PUBLIC)
                .publishDate(LocalDateTime.now().minusHours(12))
                .expiryDate(LocalDateTime.now().plusDays(15))
                .readCount(30L)
                .engagementScore(8.0)
                .isPinned(false)
                .build());

        // Seed notifications for student and parent
        notificationRepository.save(UserNotification.builder()
                .user(student)
                .notice(n1)
                .title("New Notice: " + n1.getTitle())
                .message("Priority: HIGH | Category: Events & Fest")
                .readStatus(ReadStatus.UNREAD)
                .engagementType(EngagementType.NONE)
                .build());

        notificationRepository.save(UserNotification.builder()
                .user(student)
                .notice(n2)
                .title("New Notice: " + n2.getTitle())
                .message("Priority: URGENT | Category: Examinations")
                .readStatus(ReadStatus.READ)
                .engagementType(EngagementType.LIKE)
                .readAt(LocalDateTime.now())
                .build());

        notificationRepository.save(UserNotification.builder()
                .user(parent)
                .notice(n2)
                .title("New Notice: " + n2.getTitle())
                .message("Priority: URGENT | Category: Examinations")
                .readStatus(ReadStatus.UNREAD)
                .engagementType(EngagementType.NONE)
                .build());
    }
}
