package com.luiz.lojaferramentas.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderResponseDTO(
        Integer id,
        String customerName,
        String customerEmail,
        BigDecimal totalAmount,
        String status,
        LocalDateTime createdAt,
        List<OrderItemResponseDTO> items
) {
}
