package com.luiz.lojaferramentas.service;

import com.luiz.lojaferramentas.domain.Product;
import com.luiz.lojaferramentas.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<Product> listAll() {
        return productRepository.findAll();
    }

    public Product getById(Integer id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
    }

    public Product create(Product product) {
        product.setId(null);
        return productRepository.save(product);
    }

    public Product update(Integer id, Product updated) {
        Product existing = getById(id);
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setPrice(updated.getPrice());
        existing.setStockQuantity(updated.getStockQuantity());
        existing.setSku(updated.getSku());
        existing.setImageUrl(updated.getImageUrl());
        existing.setCategory(updated.getCategory());
        return productRepository.save(existing);
    }

    public void delete(Integer id) {
        productRepository.deleteById(id);
    }
}
