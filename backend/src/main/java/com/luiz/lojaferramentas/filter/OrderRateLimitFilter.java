package com.luiz.lojaferramentas.filter;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class OrderRateLimitFilter extends OncePerRequestFilter {

    private final Map<String, Bucket> bucketsByClient = new ConcurrentHashMap<>();

    @Value("${app.security.order-rate-limit.enabled:true}")
    private boolean enabled;

    @Value("${app.security.order-rate-limit.capacity:10}")
    private int capacity;

    @Value("${app.security.order-rate-limit.refill-tokens:10}")
    private int refillTokens;

    @Value("${app.security.order-rate-limit.refill-minutes:1}")
    private long refillMinutes;

    @PostConstruct
    public void validateConfiguration() {
        if (capacity <= 0 || refillTokens <= 0 || refillMinutes <= 0) {
            throw new IllegalStateException("Order rate limit deve usar valores positivos.");
        }
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();
        if (path == null || path.isBlank()) {
            path = request.getRequestURI();
        }
        boolean isOrderCreationPath = "/api/orders".equals(path) || "/api/orders/".equals(path);
        return !enabled || !isOrderCreationPath || !"POST".equalsIgnoreCase(request.getMethod());
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String clientKey = resolveClientKey(request);
        Bucket bucket = bucketsByClient.computeIfAbsent(clientKey, ignored -> newBucket());

        if (bucket.tryConsume(1)) {
            filterChain.doFilter(request, response);
            return;
        }

        response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write("{\"message\":\"Muitas tentativas de criar pedidos. Tente novamente em alguns instantes.\"}");
    }

    private Bucket newBucket() {
        Refill refill = Refill.intervally(refillTokens, Duration.ofMinutes(refillMinutes));
        Bandwidth limit = Bandwidth.classic(capacity, refill);
        return Bucket.builder()
                .addLimit(limit)
                .build();
    }

    private String resolveClientKey(HttpServletRequest request) {
        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (forwardedFor != null && !forwardedFor.isBlank()) {
            return forwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
