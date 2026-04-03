package com.luiz.lojaferramentas.mapper;

import com.luiz.lojaferramentas.domain.Order;
import com.luiz.lojaferramentas.domain.OrderItem;
import com.luiz.lojaferramentas.dto.OrderItemResponseDTO;
import com.luiz.lojaferramentas.dto.OrderResponseDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface OrderMapper {

    OrderResponseDTO toDto(Order order);

    @Mapping(target = "productId", source = "product.id")
    @Mapping(target = "productName", source = "product.name")
    @Mapping(target = "subtotal", expression = "java(orderItem.getUnitPrice().multiply(java.math.BigDecimal.valueOf(orderItem.getQuantity())))")
    OrderItemResponseDTO toDto(OrderItem orderItem);
}
