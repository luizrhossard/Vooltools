package com.luiz.lojaferramentas.config;

import com.luiz.lojaferramentas.domain.AdminUser;
import com.luiz.lojaferramentas.repository.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class AdminUserConfig {

    @Bean
    public CommandLineRunner createAdminUser(AdminUserRepository adminUserRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            if (!adminUserRepository.existsByEmail("admin@admin.com")) {
                AdminUser admin = AdminUser.builder()
                        .username("admin")
                        .email("admin@admin.com")
                        .name("Administrador")
                        .password(passwordEncoder.encode("admin123"))
                        .role("ADMIN")
                        .build();
                adminUserRepository.save(admin);
                System.out.println("Usuário admin criado com sucesso! Email: admin@admin.com | Senha: admin123");
            }
        };
    }
}
