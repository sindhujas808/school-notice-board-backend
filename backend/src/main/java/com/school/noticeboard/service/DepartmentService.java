package com.school.noticeboard.service;

import com.school.noticeboard.dto.request.DepartmentRequest;
import com.school.noticeboard.dto.response.DepartmentDTO;

import java.util.List;

public interface DepartmentService {
    List<DepartmentDTO> getAllDepartments();
    DepartmentDTO getDepartmentById(Long id);
    DepartmentDTO createDepartment(DepartmentRequest request);
    DepartmentDTO updateDepartment(Long id, DepartmentRequest request);
    void deleteDepartment(Long id);
}
