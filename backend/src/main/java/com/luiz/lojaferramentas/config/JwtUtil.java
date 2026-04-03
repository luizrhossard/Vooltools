package com.luiz.lojaferramentas.config;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;

@Component
public class JwtUtil {

    private static final String TOKEN_TYPE_CLAIM = "token_type";
    private static final String ACCESS_TOKEN_TYPE = "access";
    private static final String REFRESH_TOKEN_TYPE = "refresh";

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration:86400000}")
    private long jwtExpiration;

    @Value("${jwt.refresh-expiration:604800000}")
    private long jwtRefreshExpiration;

    @PostConstruct
    public void validateConfig() {
        if (jwtSecret == null || jwtSecret.isBlank()) {
            throw new IllegalStateException("jwt.secret nao pode ser nulo ou vazio.");
        }

        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        if (keyBytes.length < 32) {
            throw new IllegalStateException("jwt.secret deve ter no minimo 32 bytes (256 bits).");
        }

        if (jwtExpiration <= 0 || jwtRefreshExpiration <= 0) {
            throw new IllegalStateException("JWT_EXPIRATION e JWT_REFRESH_EXPIRATION devem ser maiores que zero.");
        }
    }

    private SecretKey getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public TokenPair generateTokenPair(String username, String role) {
        return new TokenPair(
                generateAccessToken(username, role),
                generateRefreshToken(username, role)
        );
    }

    public TokenPair rotateRefreshToken(String refreshToken) {
        if (!validateRefreshToken(refreshToken)) {
            throw new IllegalArgumentException("Refresh token invalido.");
        }

        String username = extractUsername(refreshToken);
        String role = extractRole(refreshToken);
        return generateTokenPair(username, role);
    }

    public String generateAccessToken(String username, String role) {
        return buildToken(username, role, jwtExpiration, ACCESS_TOKEN_TYPE);
    }

    public String generateRefreshToken(String username, String role) {
        return buildToken(username, role, jwtRefreshExpiration, REFRESH_TOKEN_TYPE);
    }

    // Backward compatibility with existing code paths.
    public String generateToken(String username, String role) {
        return generateAccessToken(username, role);
    }

    private String buildToken(String username, String role, long expiration, String tokenType) {
        return Jwts.builder()
            .subject(username)
            .claim("role", role)
            .claim(TOKEN_TYPE_CLAIM, tokenType)
            .id(UUID.randomUUID().toString())
            .issuedAt(new Date())
            .expiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(getSigningKey())
            .compact();
    }

    public String extractUsername(String token) {
        return parseClaims(token).getPayload().getSubject();
    }

    public String extractRole(String token) {
        return parseClaims(token).getPayload().get("role", String.class);
    }

    public String extractTokenType(String token) {
        return parseClaims(token).getPayload().get(TOKEN_TYPE_CLAIM, String.class);
    }

    public boolean validateToken(String token) {
        return validateAccessToken(token);
    }

    public boolean validateAccessToken(String token) {
        return validateTokenByType(token, ACCESS_TOKEN_TYPE);
    }

    public boolean validateRefreshToken(String token) {
        return validateTokenByType(token, REFRESH_TOKEN_TYPE);
    }

    private boolean validateTokenByType(String token, String expectedType) {
        try {
            String tokenType = extractTokenType(token);
            return expectedType.equals(tokenType);
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private Jws<Claims> parseClaims(String token) {
        return Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token);
    }

    public record TokenPair(String accessToken, String refreshToken) {
    }
}
