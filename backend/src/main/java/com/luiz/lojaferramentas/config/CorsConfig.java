package com.luiz.lojaferramentas.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    private final Environment environment;
    private final String allowedOriginsProperty;

    public CorsConfig(Environment environment,
                      @Value("${app.cors.allowed-origins:}") String allowedOriginsProperty) {
        this.environment = environment;
        this.allowedOriginsProperty = allowedOriginsProperty;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        List<String> allowedOrigins = parseAllowedOrigins();
        boolean isProdProfileActive = Arrays.stream(environment.getActiveProfiles())
                .map(String::toLowerCase)
                .anyMatch(profile -> profile.equals("prod") || profile.equals("production"));

        if (allowedOrigins.contains("*")) {
            throw new IllegalStateException("CORS_ALLOWED_ORIGINS nao pode conter '*' quando credenciais estao habilitadas.");
        }

        if (isProdProfileActive && allowedOrigins.isEmpty()) {
            throw new IllegalStateException("Defina CORS_ALLOWED_ORIGINS explicitamente em producao.");
        }

        if (allowedOrigins.isEmpty()) {
            allowedOrigins = List.of(
                    "http://localhost:5173",
                    "http://127.0.0.1:5173",
                    "http://localhost:3000",
                    "http://127.0.0.1:3000"
            );
        }

        configuration.setAllowedOrigins(allowedOrigins);
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    private List<String> parseAllowedOrigins() {
        if (allowedOriginsProperty == null || allowedOriginsProperty.isBlank()) {
            return List.of();
        }

        return Arrays.stream(allowedOriginsProperty.split(","))
                .map(String::trim)
                .filter(origin -> !origin.isBlank())
                .toList();
    }
}
