package com.luiz.lojaferramentas.controller;

import com.luiz.lojaferramentas.dto.DashboardStats;
import com.luiz.lojaferramentas.repository.OrderRepository;
import com.luiz.lojaferramentas.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;

    @GetMapping("/stats")
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
