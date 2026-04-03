package com.luiz.lojaferramentas.service;

import com.luiz.lojaferramentas.domain.Order;
import com.luiz.lojaferramentas.domain.Product;
import com.luiz.lojaferramentas.dto.OrderItemRequestDTO;
import com.luiz.lojaferramentas.dto.OrderRequestDTO;
import com.luiz.lojaferramentas.dto.OrderResponseDTO;
import com.luiz.lojaferramentas.exception.ValidationException;
import com.luiz.lojaferramentas.mapper.OrderMapper;
import com.luiz.lojaferramentas.repository.OrderRepository;
import com.luiz.lojaferramentas.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private ProductRepository productRepository;

    @Mock
    private OrderMapper orderMapper;

    @InjectMocks
    private OrderService orderService;

    @Test
    void createOrderShouldUpdateStockAndCalculateTotal() {
        Product product = Product.builder()
                .id(1)
                .name("Parafusadeira")
                .price(new BigDecimal("100.00"))
                .stockQuantity(10)
                .build();
        OrderRequestDTO request = new OrderRequestDTO(
                "Cliente Teste",
                "cliente@empresa.com",
                List.of(new OrderItemRequestDTO(1, 2))
        );

        when(productRepository.findById(1)).thenReturn(Optional.of(product));
        when(productRepository.save(any(Product.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(orderMapper.toDto(any(Order.class))).thenAnswer(invocation -> {
            Order saved = invocation.getArgument(0);
            return new OrderResponseDTO(
                    1,
                    saved.getCustomerName(),
                    saved.getCustomerEmail(),
                    saved.getTotalAmount(),
                    saved.getStatus(),
                    saved.getCreatedAt(),
                    List.of()
            );
        });

        OrderResponseDTO response = orderService.createOrder(request);

        ArgumentCaptor<Order> orderCaptor = ArgumentCaptor.forClass(Order.class);
        verify(orderRepository).save(orderCaptor.capture());
        Order persistedOrder = orderCaptor.getValue();

        assertEquals(new BigDecimal("200.00"), persistedOrder.getTotalAmount());
        assertEquals(1, persistedOrder.getItems().size());
        assertEquals(8, product.getStockQuantity());
        assertEquals(new BigDecimal("200.00"), response.totalAmount());
        verify(productRepository, times(1)).save(product);
    }

    @Test
    void createOrderShouldThrowWhenStockIsInsufficient() {
        Product product = Product.builder()
                .id(1)
                .name("Serra")
                .price(new BigDecimal("250.00"))
                .stockQuantity(1)
                .build();
        OrderRequestDTO request = new OrderRequestDTO(
                "Cliente Teste",
                "cliente@empresa.com",
                List.of(new OrderItemRequestDTO(1, 2))
        );

        when(productRepository.findById(1)).thenReturn(Optional.of(product));

        assertThrows(ValidationException.class, () -> orderService.createOrder(request));
    }
}

