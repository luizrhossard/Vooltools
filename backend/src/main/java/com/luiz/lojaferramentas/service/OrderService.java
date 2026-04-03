package com.luiz.lojaferramentas.service;

import com.luiz.lojaferramentas.domain.Order;
import com.luiz.lojaferramentas.domain.OrderItem;
import com.luiz.lojaferramentas.domain.Product;
import com.luiz.lojaferramentas.dto.OrderItemRequestDTO;
import com.luiz.lojaferramentas.dto.OrderRequestDTO;
import com.luiz.lojaferramentas.dto.OrderResponseDTO;
import com.luiz.lojaferramentas.exception.ResourceNotFoundException;
import com.luiz.lojaferramentas.exception.ValidationException;
import com.luiz.lojaferramentas.mapper.OrderMapper;
import com.luiz.lojaferramentas.repository.OrderRepository;
import com.luiz.lojaferramentas.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final OrderMapper orderMapper;

    @PreAuthorize("permitAll()")
    @Transactional
    public OrderResponseDTO createOrder(OrderRequestDTO request) {
        if (request.items() == null || request.items().isEmpty()) {
            throw new ValidationException("O pedido deve conter ao menos um item.");
        }

        Order order = Order.builder()
                .customerName(request.customerName())
                .customerEmail(request.customerEmail())
                .status("CONFIRMED")
                .build();

        BigDecimal total = BigDecimal.ZERO;

        for (OrderItemRequestDTO itemDto : request.items()) {
            Product product = productRepository.findById(itemDto.productId())
                    .orElseThrow(() -> new ResourceNotFoundException("Produto nao encontrado: " + itemDto.productId()));

            if (product.getStockQuantity() < itemDto.quantity()) {
                throw new ValidationException("Estoque insuficiente para o produto: " + product.getName());
            }

            product.setStockQuantity(product.getStockQuantity() - itemDto.quantity());
            productRepository.save(product);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemDto.quantity())
                    .unitPrice(product.getPrice())
                    .build();

            order.getItems().add(orderItem);
            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(itemDto.quantity())));
        }

        order.setTotalAmount(total);
        Order savedOrder = orderRepository.save(order);
        return orderMapper.toDto(savedOrder);
    }
}
