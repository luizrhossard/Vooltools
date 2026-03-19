package com.luiz.lojaferramentas.dto;

import java.util.List;

public record OrderRequestDTO(
        String customerName,
        String customerEmail,
        List<OrderItemRequestDTO> items) {
}
