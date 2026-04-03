package com.luiz.lojaferramentas.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoryRequestDTO(
        @NotBlank(message = "name e obrigatorio")
        @Size(max = 120, message = "name deve ter no maximo 120 caracteres")
        String name,
        @Size(max = 500, message = "description deve ter no maximo 500 caracteres")
        String description
) {
}
