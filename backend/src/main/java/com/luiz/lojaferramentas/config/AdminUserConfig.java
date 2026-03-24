package com.luiz.lojaferramentas.config;

import com.luiz.lojaferramentas.domain.AdminUser;
import com.luiz.lojaferramentas.repository.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class AdminUserConfig {

    @Bean
    public CommandLineRunner createAdminUser(
            AdminUserRepository adminUserRepository,
            PasswordEncoder passwordEncoder,
            @Value("${app.admin.bootstrap-enabled:false}") boolean bootstrapEnabled,
            @Value("${app.admin.username:}") String username,
            @Value("${app.admin.email:}") String email,
            @Value("${app.admin.name:Administrador}") String name,
            @Value("${app.admin.password:}") String password
    ) {
        return args -> {
            if (!bootstrapEnabled) {
                return;
            }

            if (username.isBlank() || email.isBlank() || password.isBlank()) {
                throw new IllegalStateException("Para bootstrap de admin, configure app.admin.username, app.admin.email e app.admin.password.");
            }

            if (!adminUserRepository.existsByEmail(email)) {
                AdminUser admin = AdminUser.builder()
                        .username(username)
                        .email(email)
                        .name(name)
                        .password(passwordEncoder.encode(password))
                        .role("ADMIN")
                        .build();
                adminUserRepository.save(admin);
                System.out.println("Usuario admin bootstrap criado com sucesso.");
            }
        };
    }
}
