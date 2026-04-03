package com.luiz.lojaferramentas.mapper;

import com.luiz.lojaferramentas.domain.Category;
import com.luiz.lojaferramentas.dto.CategoryDTO;
import com.luiz.lojaferramentas.dto.CategoryRequestDTO;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CategoryMapper {

    CategoryDTO toDto(Category category);

    List<CategoryDTO> toDtoList(List<Category> categories);

    Category toEntity(CategoryRequestDTO request);
}
