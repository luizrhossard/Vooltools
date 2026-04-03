package com.luiz.lojaferramentas.dto;

import java.time.LocalDate;

public record BannerDTO(
        Integer id,
        String title,
        String subtitle,
        String imageUrl,
        String linkUrl,
        Integer displayOrder,
        Boolean active,
        LocalDate startDate,
        LocalDate endDate,
        Boolean showPriceBadge,
        String priceBadgePrefix,
        String priceBadgeValue
) {
}
