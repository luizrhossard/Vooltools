package com.luiz.lojaferramentas.config;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class JwtUtilTest {

    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
    }

    @Test
    void validateConfigShouldRejectSecretSmallerThan32Bytes() {
        ReflectionTestUtils.setField(jwtUtil, "jwtSecret", "secret-curto");
        ReflectionTestUtils.setField(jwtUtil, "jwtExpiration", 86_400_000L);
        ReflectionTestUtils.setField(jwtUtil, "jwtRefreshExpiration", 604_800_000L);

        assertThrows(IllegalStateException.class, jwtUtil::validateConfig);
    }

    @Test
    void generateTokenPairShouldCreateValidAccessAndRefreshTokens() {
        ReflectionTestUtils.setField(jwtUtil, "jwtSecret", "12345678901234567890123456789012");
        ReflectionTestUtils.setField(jwtUtil, "jwtExpiration", 86_400_000L);
        ReflectionTestUtils.setField(jwtUtil, "jwtRefreshExpiration", 604_800_000L);
        jwtUtil.validateConfig();

        JwtUtil.TokenPair pair = jwtUtil.generateTokenPair("admin@empresa.com", "ADMIN");

        assertNotNull(pair.accessToken());
        assertNotNull(pair.refreshToken());
        assertTrue(jwtUtil.validateAccessToken(pair.accessToken()));
        assertTrue(jwtUtil.validateRefreshToken(pair.refreshToken()));
        assertEquals("admin@empresa.com", jwtUtil.extractUsername(pair.accessToken()));
        assertEquals("ADMIN", jwtUtil.extractRole(pair.accessToken()));
        assertEquals("access", jwtUtil.extractTokenType(pair.accessToken()));
        assertEquals("refresh", jwtUtil.extractTokenType(pair.refreshToken()));
    }
}

