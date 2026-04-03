package com.luiz.lojaferramentas.repository;

import com.luiz.lojaferramentas.domain.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Integer> {
}
