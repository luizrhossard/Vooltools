package com.luiz.lojaferramentas.service;

import com.luiz.lojaferramentas.domain.Category;
import com.luiz.lojaferramentas.dto.CategoryDTO;
import com.luiz.lojaferramentas.dto.CategoryRequestDTO;
import com.luiz.lojaferramentas.exception.ResourceNotFoundException;
import com.luiz.lojaferramentas.mapper.CategoryMapper;
import com.luiz.lojaferramentas.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    public List<CategoryDTO> listAll() {
        return categoryMapper.toDtoList(categoryRepository.findAll());
    }

    public CategoryDTO getById(Integer id) {
        return categoryMapper.toDto(findCategoryById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    public CategoryDTO create(CategoryRequestDTO request) {
        Category category = categoryMapper.toEntity(request);
        category.setId(null);
        return categoryMapper.toDto(categoryRepository.save(category));
    }

    @PreAuthorize("hasRole('ADMIN')")
    public CategoryDTO update(Integer id, CategoryRequestDTO request) {
        Category existing = findCategoryById(id);
        existing.setName(request.name());
        existing.setDescription(request.description());
        return categoryMapper.toDto(categoryRepository.save(existing));
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void delete(Integer id) {
        Category category = findCategoryById(id);
        categoryRepository.delete(category);
    }

    private Category findCategoryById(Integer id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria nao encontrada: " + id));
    }
}
