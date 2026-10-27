package com.school.noticeboard.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DepartmentPerformanceDTO {

    private String departmentName;
    private Long totalNotices;
    private Double averageReads;
    private Long urgentNotices;
}
