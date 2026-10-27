package com.school.noticeboard.service.impl;

import com.school.noticeboard.dto.request.CategoryRequest;
import com.school.noticeboard.dto.response.CategoryDTO;
import com.school.noticeboard.entity.Category;
import com.school.noticeboard.exception.DuplicateResourceException;
import com.school.noticeboard.exception.ResourceNotFoundException;
import com.school.noticeboard.repository.CategoryRepository;
import com.school.noticeboard.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    @Transactional(readOnly = true)
    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public CategoryDTO getCategoryById(Long id) {
        Category cat = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));
        return mapToDTO(cat);
    }

    @Override
    @Transactional
    public CategoryDTO createCategory(CategoryRequest request) {
        if (categoryRepository.existsByCategoryName(request.getCategoryName())) {
            throw new DuplicateResourceException("Category already exists: " + request.getCategoryName());
        }

        Category category = Category.builder()
                .categoryName(request.getCategoryName())
                .colorCode(request.getColorCode() != null ? request.getColorCode() : "#3b82f6")
                .description(request.getDescription())
                .build();

        return mapToDTO(categoryRepository.save(category));
    }

    @Override
    @Transactional
    public CategoryDTO updateCategory(Long id, CategoryRequest request) {
        Category cat = categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + id));

        cat.setCategoryName(request.getCategoryName());
        if (request.getColorCode() != null) {
            cat.setColorCode(request.getColorCode());
        }
        cat.setDescription(request.getDescription());

        return mapToDTO(categoryRepository.save(cat));
    }

    @Override
    @Transactional
    public void deleteCategory(Long id) {
        if (!categoryRepository.existsById(id)) {
            throw new ResourceNotFoundException("Category not found with id: " + id);
        }
        categoryRepository.deleteById(id);
    }

    private CategoryDTO mapToDTO(Category cat) {
        return CategoryDTO.builder()
                .id(cat.getId())
                .categoryName(cat.getCategoryName())
                .colorCode(cat.getColorCode())
                .description(cat.getDescription())
                .createdAt(cat.getCreatedAt())
                .build();
    }
}
