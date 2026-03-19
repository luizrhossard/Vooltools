package com.luiz.lojaferramentas.dto;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardStats {

    private Long totalProducts;
    private Long totalOrders;
    private Long pendingOrders;
    private BigDecimal totalRevenue;
    private Long lowStockProducts;
}
