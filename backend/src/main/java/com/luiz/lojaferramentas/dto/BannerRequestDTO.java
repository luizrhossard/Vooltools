package com.luiz.lojaferramentas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record BannerRequestDTO(
        @NotBlank(message = "title e obrigatorio")
        @Size(max = 180, message = "title deve ter no maximo 180 caracteres")
        String title,
        @Size(max = 500, message = "subtitle deve ter no maximo 500 caracteres")
        String subtitle,
        @Size(max = 2000, message = "imageUrl deve ter no maximo 2000 caracteres")
        String imageUrl,
        @Size(max = 2000, message = "linkUrl deve ter no maximo 2000 caracteres")
        String linkUrl,
        Integer displayOrder,
        @NotNull(message = "active e obrigatorio")
        Boolean active,
        LocalDate startDate,
        LocalDate endDate,
        Boolean showPriceBadge,
        @Size(max = 100, message = "priceBadgePrefix deve ter no maximo 100 caracteres")
        String priceBadgePrefix,
        @Size(max = 100, message = "priceBadgeValue deve ter no maximo 100 caracteres")
        String priceBadgeValue
) {
}
