package com.school.noticeboard.repository;

import com.school.noticeboard.entity.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DepartmentRepository extends JpaRepository<Department, Long> {
    Optional<Department> findByDepartmentName(String departmentName);
    Optional<Department> findByCode(String code);
    Boolean existsByDepartmentName(String departmentName);
    Boolean existsByCode(String code);
}
