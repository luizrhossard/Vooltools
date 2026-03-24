package com.luiz.lojaferramentas.service;

import com.luiz.lojaferramentas.config.JwtUtil;
import com.luiz.lojaferramentas.domain.AdminUser;
import com.luiz.lojaferramentas.dto.AuthResponse;
import com.luiz.lojaferramentas.dto.LoginRequest;
import com.luiz.lojaferramentas.exception.InvalidCredentialsException;
import com.luiz.lojaferramentas.exception.ResourceConflictException;
import com.luiz.lojaferramentas.exception.ResourceNotFoundException;
import com.luiz.lojaferramentas.repository.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AdminUserRepository adminUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse login(LoginRequest request) {
        AdminUser user = adminUserRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Credenciais invalidas"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Credenciais invalidas");
        }

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

        AuthResponse.UserInfo userInfo = AuthResponse.UserInfo.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole())
                .build();

        return new AuthResponse(token, userInfo);
    }

    public void register(AdminUser user) {
        if (adminUserRepository.existsByEmail(user.getEmail())) {
            throw new ResourceConflictException("E-mail ja cadastrado");
        }
        adminUserRepository.save(user);
    }

    public AdminUser getCurrentUser(String email) {
        return adminUserRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario nao encontrado"));
    }
}
