package com.luiz.lojaferramentas.repository;

import com.luiz.lojaferramentas.domain.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {
    
    long countByStockQuantityLessThanEqual(int stockQuantity);
}
