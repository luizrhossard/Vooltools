package com.luiz.lojaferramentas.controller;

import com.luiz.lojaferramentas.domain.Order;
import com.luiz.lojaferramentas.dto.OrderRequestDTO;
import com.luiz.lojaferramentas.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Order createOrder(@RequestBody OrderRequestDTO request) {
        return orderService.createOrder(request);
    }
}
