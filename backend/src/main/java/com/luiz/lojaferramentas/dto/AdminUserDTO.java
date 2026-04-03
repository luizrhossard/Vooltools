package com.luiz.lojaferramentas.dto;

import java.time.LocalDateTime;

public record AdminUserDTO(
        Integer id,
        String username,
        String email,
        String name,
        String role,
        LocalDateTime createdAt
) {
}
