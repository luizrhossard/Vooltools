package com.luiz.lojaferramentas.service;

import com.luiz.lojaferramentas.domain.Order;
import com.luiz.lojaferramentas.domain.OrderItem;
import com.luiz.lojaferramentas.domain.Product;
import com.luiz.lojaferramentas.dto.OrderRequestDTO;
import com.luiz.lojaferramentas.dto.OrderItemRequestDTO;
import com.luiz.lojaferramentas.repository.OrderRepository;
import com.luiz.lojaferramentas.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    // O @Transactional garante que se der erro no meio (ex: estoque insuficiente),
    // ele dá Rollback em tudo e não salva o pedido quebrado.
    @Transactional
    public Order createOrder(OrderRequestDTO request) {

        Order order = Order.builder()
                .customerName(request.customerName())
                .customerEmail(request.customerEmail())
                .status("CONFIRMED") // Já confirmamos direto para simplificar
                .build();

        BigDecimal total = BigDecimal.ZERO;

        for (OrderItemRequestDTO itemDto : request.items()) {
            Product product = productRepository.findById(itemDto.productId())
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado: " + itemDto.productId()));

            // Verifica estoque (simulação simples)
            if (product.getStockQuantity() < itemDto.quantity()) {
                throw new RuntimeException("Estoque insuficiente para o produto: " + product.getName());
            }

            // Baixa o estoque do produto
            product.setStockQuantity(product.getStockQuantity() - itemDto.quantity());
            productRepository.save(product);

            // Cria o item do pedido
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemDto.quantity())
                    .unitPrice(product.getPrice()) // Salva o preço da ferramenta hoje
                    .build();

            order.getItems().add(orderItem);

            // Soma no total: quantidade * preço
            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(itemDto.quantity()));
            total = total.add(itemTotal);
        }

        order.setTotalAmount(total);

        // O Hibernate salvará o Order e os OrderItems juntos por causa do
        // CascadeType.ALL
        return orderRepository.save(order);
    }
}
