package com.school.noticeboard.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentRequest {

    @NotBlank(message = "Department name cannot be blank")
    private String departmentName;

    @NotBlank(message = "Department code cannot be blank")
    private String code;

    private String description;
}
