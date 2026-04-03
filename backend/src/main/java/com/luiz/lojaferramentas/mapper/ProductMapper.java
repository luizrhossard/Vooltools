package com.luiz.lojaferramentas.mapper;

import com.luiz.lojaferramentas.domain.Product;
import com.luiz.lojaferramentas.dto.ProductDTO;
import com.luiz.lojaferramentas.dto.ProductRequestDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring", uses = CategoryMapper.class)
public interface ProductMapper {

    ProductDTO toDto(Product product);

    List<ProductDTO> toDtoList(List<Product> products);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "category", ignore = true)
    Product toEntity(ProductRequestDTO request);
}
