package com.luiz.lojaferramentas.repository;

import com.luiz.lojaferramentas.domain.Banner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BannerRepository extends JpaRepository<Banner, Integer> {
    
    List<Banner> findByActiveTrueOrderByDisplayOrderAsc();
    
    List<Banner> findAllByOrderByDisplayOrderAsc();
}
