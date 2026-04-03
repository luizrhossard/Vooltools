package com.luiz.lojaferramentas.service;

import com.luiz.lojaferramentas.domain.Category;
import com.luiz.lojaferramentas.domain.Product;
import com.luiz.lojaferramentas.dto.ProductDTO;
import com.luiz.lojaferramentas.dto.ProductRequestDTO;
import com.luiz.lojaferramentas.exception.ResourceNotFoundException;
import com.luiz.lojaferramentas.mapper.ProductMapper;
import com.luiz.lojaferramentas.repository.CategoryRepository;
import com.luiz.lojaferramentas.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;

    public List<ProductDTO> listAll() {
        return productMapper.toDtoList(productRepository.findAll());
    }

    public ProductDTO getById(Integer id) {
        return productMapper.toDto(findProductById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    public ProductDTO create(ProductRequestDTO request) {
        Product product = productMapper.toEntity(request);
        product.setId(null);
        product.setCategory(findCategoryById(request.categoryId()));
        product.setFeatured(request.featured() != null ? request.featured() : false);
        return productMapper.toDto(productRepository.save(product));
    }

    @PreAuthorize("hasRole('ADMIN')")
    public ProductDTO update(Integer id, ProductRequestDTO request) {
        Product existing = findProductById(id);
        existing.setName(request.name());
        existing.setDescription(request.description());
        existing.setPrice(request.price());
        existing.setStockQuantity(request.stockQuantity());
        existing.setSku(request.sku());
        existing.setImageUrl(request.imageUrl());
        existing.setCategory(findCategoryById(request.categoryId()));
        existing.setFeatured(request.featured() != null ? request.featured() : false);
        return productMapper.toDto(productRepository.save(existing));
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void delete(Integer id) {
        Product existing = findProductById(id);
        productRepository.delete(existing);
    }

    private Product findProductById(Integer id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Produto nao encontrado: " + id));
    }

    private Category findCategoryById(Integer id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria nao encontrada: " + id));
    }
}
