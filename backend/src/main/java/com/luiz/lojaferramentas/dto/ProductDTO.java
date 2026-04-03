package com.luiz.lojaferramentas.dto;

import java.math.BigDecimal;

public record ProductDTO(
        Integer id,
        String name,
        String description,
        BigDecimal price,
        Integer stockQuantity,
        String sku,
        String imageUrl,
        CategoryDTO category,
        Boolean featured
) {
}
