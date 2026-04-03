package com.luiz.lojaferramentas.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record OrderItemRequestDTO(
                @NotNull(message = "productId e obrigatorio")
                Integer productId,
                @NotNull(message = "quantity e obrigatorio")
                @Min(value = 1, message = "quantity deve ser ao menos 1")
                Integer quantity) {
}
