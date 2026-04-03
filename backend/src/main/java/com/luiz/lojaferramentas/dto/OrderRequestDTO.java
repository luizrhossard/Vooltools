package com.luiz.lojaferramentas.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;

import java.util.List;

public record OrderRequestDTO(
        @NotBlank(message = "customerName e obrigatorio")
        String customerName,
        @NotBlank(message = "customerEmail e obrigatorio")
        @Email(message = "customerEmail invalido")
        String customerEmail,
        @NotEmpty(message = "items deve conter ao menos um item")
        @Valid
        List<OrderItemRequestDTO> items) {
}
