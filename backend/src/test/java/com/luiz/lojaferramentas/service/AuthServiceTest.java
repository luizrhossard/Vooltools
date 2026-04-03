package com.luiz.lojaferramentas.service;

import com.luiz.lojaferramentas.config.JwtUtil;
import com.luiz.lojaferramentas.domain.AdminUser;
import com.luiz.lojaferramentas.dto.AuthResponse;
import com.luiz.lojaferramentas.dto.LoginRequest;
import com.luiz.lojaferramentas.dto.RegisterRequestDTO;
import com.luiz.lojaferramentas.exception.InvalidCredentialsException;
import com.luiz.lojaferramentas.exception.ResourceConflictException;
import com.luiz.lojaferramentas.mapper.AdminUserMapper;
import com.luiz.lojaferramentas.repository.AdminUserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AdminUserRepository adminUserRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private AdminUserMapper adminUserMapper;

    @InjectMocks
    private AuthService authService;

    @Test
    void loginShouldReturnTokensAndUserWhenCredentialsAreValid() {
        LoginRequest request = new LoginRequest("admin@empresa.com", "senha");
        AdminUser user = AdminUser.builder()
                .id(1)
                .email("admin@empresa.com")
                .name("Administrador")
                .role("ADMIN")
                .password("hashed-password")
                .build();
        JwtUtil.TokenPair tokenPair = new JwtUtil.TokenPair("access-token", "refresh-token");

        when(adminUserRepository.findByEmail("admin@empresa.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("senha", "hashed-password")).thenReturn(true);
        when(jwtUtil.generateTokenPair("admin@empresa.com", "ADMIN")).thenReturn(tokenPair);

        AuthResponse response = authService.login(request);

        assertEquals("access-token", response.getToken());
        assertEquals("refresh-token", response.getRefreshToken());
        assertEquals("admin@empresa.com", response.getUser().getEmail());
        assertEquals("ADMIN", response.getUser().getRole());
    }

    @Test
    void loginShouldThrowWhenPasswordIsInvalid() {
        LoginRequest request = new LoginRequest("admin@empresa.com", "senha-invalida");
        AdminUser user = AdminUser.builder()
                .email("admin@empresa.com")
                .password("hashed-password")
                .build();

        when(adminUserRepository.findByEmail("admin@empresa.com")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("senha-invalida", "hashed-password")).thenReturn(false);

        assertThrows(InvalidCredentialsException.class, () -> authService.login(request));
        verify(jwtUtil, never()).generateTokenPair(org.mockito.ArgumentMatchers.anyString(), org.mockito.ArgumentMatchers.anyString());
    }

    @Test
    void registerShouldThrowWhenEmailAlreadyExists() {
        RegisterRequestDTO request = new RegisterRequestDTO(
                "admin",
                "admin@empresa.com",
                "Administrador",
                "senha-forte-123"
        );

        when(adminUserRepository.existsByEmail("admin@empresa.com")).thenReturn(true);

        assertThrows(ResourceConflictException.class, () -> authService.register(request));
        verify(adminUserRepository, never()).save(org.mockito.ArgumentMatchers.any(AdminUser.class));
    }

    @Test
    void refreshShouldThrowWhenTokenIsInvalid() {
        when(jwtUtil.validateRefreshToken("refresh-invalido")).thenReturn(false);

        assertThrows(InvalidCredentialsException.class, () -> authService.refreshToken("refresh-invalido"));
    }
}

