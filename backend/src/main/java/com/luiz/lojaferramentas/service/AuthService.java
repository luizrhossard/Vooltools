package com.luiz.lojaferramentas.service;

import com.luiz.lojaferramentas.config.JwtUtil;
import com.luiz.lojaferramentas.domain.AdminUser;
import com.luiz.lojaferramentas.dto.AdminUserDTO;
import com.luiz.lojaferramentas.dto.AuthResponse;
import com.luiz.lojaferramentas.dto.LoginRequest;
import com.luiz.lojaferramentas.dto.RegisterRequestDTO;
import com.luiz.lojaferramentas.exception.InvalidCredentialsException;
import com.luiz.lojaferramentas.exception.ResourceConflictException;
import com.luiz.lojaferramentas.exception.ResourceNotFoundException;
import com.luiz.lojaferramentas.mapper.AdminUserMapper;
import com.luiz.lojaferramentas.repository.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AdminUserMapper adminUserMapper;

    public AuthResponse login(LoginRequest request) {
        AdminUser user = adminUserRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Credenciais invalidas"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Credenciais invalidas");
        }

        JwtUtil.TokenPair tokenPair = jwtUtil.generateTokenPair(user.getEmail(), user.getRole());
        return buildAuthResponse(user, tokenPair);
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void register(RegisterRequestDTO request) {
        if (adminUserRepository.existsByEmail(request.email())) {
            throw new ResourceConflictException("E-mail ja cadastrado");
        }
        if (adminUserRepository.existsByUsername(request.username())) {
            throw new ResourceConflictException("Username ja cadastrado");
        }

        AdminUser user = AdminUser.builder()
                .username(request.username())
                .email(request.email())
                .name(request.name())
                .password(passwordEncoder.encode(request.password()))
                .role("ADMIN")
                .build();
        adminUserRepository.save(user);
    }

    @PreAuthorize("isAuthenticated()")
    public AdminUserDTO getCurrentUser(String email) {
        AdminUser user = adminUserRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario nao encontrado"));
        return adminUserMapper.toDto(user);
    }

    public AuthResponse refreshToken(String refreshToken) {
        if (!jwtUtil.validateRefreshToken(refreshToken)) {
            throw new InvalidCredentialsException("Refresh token invalido");
        }

        String email = jwtUtil.extractUsername(refreshToken);
        AdminUser user = adminUserRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentialsException("Usuario do refresh token nao encontrado"));

        JwtUtil.TokenPair rotatedTokens = jwtUtil.rotateRefreshToken(refreshToken);
        return buildAuthResponse(user, rotatedTokens);
    }

    private AuthResponse buildAuthResponse(AdminUser user, JwtUtil.TokenPair tokenPair) {
        AuthResponse.UserInfo userInfo = AuthResponse.UserInfo.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole())
                .build();

        return AuthResponse.builder()
                .token(tokenPair.accessToken())
                .refreshToken(tokenPair.refreshToken())
                .user(userInfo)
                .build();
    }
}
