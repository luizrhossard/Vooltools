package com.luiz.lojaferramentas.config;

import com.luiz.lojaferramentas.domain.AdminUser;
import com.luiz.lojaferramentas.repository.AdminUserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;

@Configuration
@RequiredArgsConstructor
public class AdminUserConfig {

    private static final Logger log = LoggerFactory.getLogger(AdminUserConfig.class);

    @Bean
    public CommandLineRunner createAdminUser(
            AdminUserRepository adminUserRepository,
            PasswordEncoder passwordEncoder,
            Environment environment,
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

            boolean isProdProfileActive = Arrays.stream(environment.getActiveProfiles())
                    .map(String::toLowerCase)
                    .anyMatch(profile -> profile.equals("prod") || profile.equals("production"));

            if (isProdProfileActive) {
                log.error("APP_ADMIN_BOOTSTRAP_ENABLED=true em producao foi bloqueado por seguranca. O admin bootstrap nao sera executado.");
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
                log.info("Usuario admin bootstrap criado com sucesso.");
            }
        };
    }
}
