package com.luiz.lojaferramentas.service;

import com.luiz.lojaferramentas.domain.Category;
import com.luiz.lojaferramentas.domain.Product;
import com.luiz.lojaferramentas.dto.ProductDTO;
import com.luiz.lojaferramentas.dto.ProductRequestDTO;
import com.luiz.lojaferramentas.exception.ResourceNotFoundException;
import com.luiz.lojaferramentas.mapper.ProductMapper;
import com.luiz.lojaferramentas.repository.CategoryRepository;
import com.luiz.lojaferramentas.repository.ProductRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private ProductMapper productMapper;

    @InjectMocks
    private ProductService productService;

    @Test
    void createShouldSetCategoryAndDefaultFeaturedWhenNull() {
        ProductRequestDTO request = new ProductRequestDTO(
                "Furadeira",
                "Profissional",
                new BigDecimal("199.90"),
                5,
                "SKU-123",
                "https://cdn.exemplo.com/furadeira.png",
                new ProductRequestDTO.CategoryReferenceDTO(7),
                null
        );

        Product mappedProduct = Product.builder()
                .name("Furadeira")
                .description("Profissional")
                .price(new BigDecimal("199.90"))
                .stockQuantity(5)
                .sku("SKU-123")
                .build();
        Category category = Category.builder().id(7).name("Eletricas").build();
        Product savedProduct = Product.builder().id(10).name("Furadeira").build();
        ProductDTO dto = new ProductDTO(10, "Furadeira", "Profissional", new BigDecimal("199.90"), 5, "SKU-123", null, null, false);

        when(productMapper.toEntity(request)).thenReturn(mappedProduct);
        when(categoryRepository.findById(7)).thenReturn(Optional.of(category));
        when(productRepository.save(any(Product.class))).thenReturn(savedProduct);
        when(productMapper.toDto(savedProduct)).thenReturn(dto);

        ProductDTO result = productService.create(request);

        ArgumentCaptor<Product> productCaptor = ArgumentCaptor.forClass(Product.class);
        verify(productRepository).save(productCaptor.capture());
        Product persistedProduct = productCaptor.getValue();

        assertSame(category, persistedProduct.getCategory());
        assertFalse(persistedProduct.getFeatured());
        assertEquals(dto, result);
    }

    @Test
    void getByIdShouldThrowWhenProductDoesNotExist() {
        when(productRepository.findById(99)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> productService.getById(99));
    }
}

