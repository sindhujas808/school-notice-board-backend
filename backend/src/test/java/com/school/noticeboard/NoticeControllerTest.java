package com.school.noticeboard;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.school.noticeboard.dto.request.NoticeCreateRequest;
import com.school.noticeboard.entity.Category;
import com.school.noticeboard.entity.Department;
import com.school.noticeboard.entity.User;
import com.school.noticeboard.enums.AudienceType;
import com.school.noticeboard.enums.NoticeStatus;
import com.school.noticeboard.enums.Priority;
import com.school.noticeboard.enums.Role;
import com.school.noticeboard.repository.CategoryRepository;
import com.school.noticeboard.repository.DepartmentRepository;
import com.school.noticeboard.repository.NoticeRepository;
import com.school.noticeboard.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class NoticeControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private NoticeRepository noticeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    private Category testCategory;
    private Department testDept;

    @BeforeEach
    void setUp() {
        if (!userRepository.existsByUsername("teacher_test")) {
            testDept = departmentRepository.save(Department.builder()
                    .departmentName("Science Dept")
                    .code("SCI")
                    .build());

            testCategory = categoryRepository.save(Category.builder()
                    .categoryName("General Test")
                    .colorCode("#3b82f6")
                    .build());

            userRepository.save(User.builder()
                    .username("teacher_test")
                    .email("teacher_test@school.edu")
                    .password(passwordEncoder.encode("password123"))
                    .fullName("Teacher Test")
                    .role(Role.TEACHER)
                    .department(testDept)
                    .accountNonLocked(true)
                    .build());
        } else {
            testDept = departmentRepository.findByCode("SCI").orElse(null);
            testCategory = categoryRepository.findByCategoryName("General Test").orElse(null);
        }
    }

    @Test
    @WithMockUser(username = "teacher_test", roles = {"TEACHER"})
    void testCreateNotice_Success() throws Exception {
        Set<Role> roles = new HashSet<>();
        roles.add(Role.STUDENT);

        NoticeCreateRequest request = NoticeCreateRequest.builder()
                .title("New Workshop Announced")
                .content("Detailed agenda of workshop")
                .categoryId(testCategory != null ? testCategory.getId() : null)
                .categoryName("General Test")
                .priority(Priority.HIGH)
                .audienceType(AudienceType.ROLE_BASED)
                .targetRoles(roles)
                .status(NoticeStatus.PUBLISHED)
                .publishDate(LocalDateTime.now())
                .build();

        mockMvc.perform(post("/api/notices")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.title").value("New Workshop Announced"));
    }

    @Test
    @WithMockUser(username = "teacher_test", roles = {"TEACHER"})
    void testGetNotices_Pagination() throws Exception {
        mockMvc.perform(get("/api/notices")
                        .param("page", "0")
                        .param("size", "10")
                        .param("sortBy", "publishDate")
                        .param("sortDir", "desc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    void testGetPublicNotices_Unauthenticated() throws Exception {
        mockMvc.perform(get("/api/notices/public"))
                .andExpect(status().isOk());
    }
}
