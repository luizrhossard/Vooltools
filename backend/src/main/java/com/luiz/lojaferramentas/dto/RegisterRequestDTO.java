package com.luiz.lojaferramentas.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequestDTO(
        @NotBlank(message = "username e obrigatorio")
        @Size(min = 3, max = 50, message = "username deve ter entre 3 e 50 caracteres")
        String username,
        @NotBlank(message = "email e obrigatorio")
        @Email(message = "email invalido")
        String email,
        @NotBlank(message = "name e obrigatorio")
        @Size(min = 3, max = 100, message = "name deve ter entre 3 e 100 caracteres")
        String name,
        @NotBlank(message = "password e obrigatorio")
        @Size(min = 8, max = 100, message = "password deve ter entre 8 e 100 caracteres")
        String password
) {
}
