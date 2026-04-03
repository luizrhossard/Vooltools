package com.luiz.lojaferramentas.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record ProductRequestDTO(
        @NotBlank(message = "name e obrigatorio")
        @Size(max = 180, message = "name deve ter no maximo 180 caracteres")
        String name,
        @Size(max = 1000, message = "description deve ter no maximo 1000 caracteres")
        String description,
        @NotNull(message = "price e obrigatorio")
        @DecimalMin(value = "0.0", inclusive = false, message = "price deve ser maior que zero")
        BigDecimal price,
        @NotNull(message = "stockQuantity e obrigatorio")
        @Min(value = 0, message = "stockQuantity nao pode ser negativo")
        Integer stockQuantity,
        @NotBlank(message = "sku e obrigatorio")
        @Size(max = 50, message = "sku deve ter no maximo 50 caracteres")
        String sku,
        @Size(max = 255, message = "imageUrl deve ter no maximo 255 caracteres")
        String imageUrl,
        @NotNull(message = "category e obrigatoria")
        @Valid
        CategoryReferenceDTO category,
        Boolean featured
) {
    public Integer categoryId() {
        return category != null ? category.id() : null;
    }

    public record CategoryReferenceDTO(
            @NotNull(message = "category.id e obrigatorio")
            Integer id
    ) {
    }
}
