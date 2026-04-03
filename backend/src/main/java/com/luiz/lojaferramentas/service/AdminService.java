package com.luiz.lojaferramentas.service;

import com.luiz.lojaferramentas.dto.DashboardStats;
import com.luiz.lojaferramentas.repository.OrderRepository;
import com.luiz.lojaferramentas.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    @PreAuthorize("hasRole('ADMIN')")
    public DashboardStats getStats() {
        long totalProducts = productRepository.count();
        long totalOrders = orderRepository.count();
        long pendingOrders = orderRepository.countByStatus("PENDING");

        BigDecimal totalRevenue = orderRepository.sumTotalAmount() != null
                ? orderRepository.sumTotalAmount()
                : BigDecimal.ZERO;

        long lowStockProducts = productRepository.countByStockQuantityLessThanEqual(10);

        return DashboardStats.builder()
                .totalProducts(totalProducts)
                .totalOrders(totalOrders)
                .pendingOrders(pendingOrders)
                .totalRevenue(totalRevenue)
                .lowStockProducts(lowStockProducts)
                .build();
    }
}
