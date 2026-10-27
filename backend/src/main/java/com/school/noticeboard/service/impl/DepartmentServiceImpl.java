package com.school.noticeboard.service.impl;

import com.school.noticeboard.dto.request.DepartmentRequest;
import com.school.noticeboard.dto.response.DepartmentDTO;
import com.school.noticeboard.entity.Department;
import com.school.noticeboard.exception.DuplicateResourceException;
import com.school.noticeboard.exception.ResourceNotFoundException;
import com.school.noticeboard.repository.DepartmentRepository;
import com.school.noticeboard.service.DepartmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentRepository departmentRepository;

    @Override
    @Transactional(readOnly = true)
    public List<DepartmentDTO> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public DepartmentDTO getDepartmentById(Long id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));
        return mapToDTO(dept);
    }

    @Override
    @Transactional
    public DepartmentDTO createDepartment(DepartmentRequest request) {
        if (departmentRepository.existsByDepartmentName(request.getDepartmentName())) {
            throw new DuplicateResourceException("Department name already exists: " + request.getDepartmentName());
        }
        if (departmentRepository.existsByCode(request.getCode())) {
            throw new DuplicateResourceException("Department code already exists: " + request.getCode());
        }

        Department department = Department.builder()
                .departmentName(request.getDepartmentName())
                .code(request.getCode().toUpperCase())
                .description(request.getDescription())
                .build();

        return mapToDTO(departmentRepository.save(department));
    }

    @Override
    @Transactional
    public DepartmentDTO updateDepartment(Long id, DepartmentRequest request) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department not found with id: " + id));

        dept.setDepartmentName(request.getDepartmentName());
        dept.setCode(request.getCode().toUpperCase());
        dept.setDescription(request.getDescription());

        return mapToDTO(departmentRepository.save(dept));
    }

    @Override
    @Transactional
    public void deleteDepartment(Long id) {
        if (!departmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Department not found with id: " + id);
        }
        departmentRepository.deleteById(id);
    }

    private DepartmentDTO mapToDTO(Department dept) {
        return DepartmentDTO.builder()
                .id(dept.getId())
                .departmentName(dept.getDepartmentName())
                .code(dept.getCode())
                .description(dept.getDescription())
                .createdAt(dept.getCreatedAt())
                .build();
    }
}
