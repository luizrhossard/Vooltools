package com.luiz.lojaferramentas.service;

import com.luiz.lojaferramentas.domain.Banner;
import com.luiz.lojaferramentas.repository.BannerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BannerService {

    private final BannerRepository bannerRepository;

    public List<Banner> listAll() {
        return bannerRepository.findAllByOrderByDisplayOrderAsc();
    }

    public List<Banner> listActive() {
        return bannerRepository.findByActiveTrueOrderByDisplayOrderAsc();
    }

    public Banner getById(Integer id) {
        return bannerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Banner não encontrado"));
    }

    public Banner create(Banner banner) {
        banner.setId(null);
        return bannerRepository.save(banner);
    }

    public Banner update(Integer id, Banner updated) {
        Banner existing = getById(id);
        existing.setTitle(updated.getTitle());
        existing.setSubtitle(updated.getSubtitle());
        existing.setImageUrl(updated.getImageUrl());
        existing.setLinkUrl(updated.getLinkUrl());
        existing.setDisplayOrder(updated.getDisplayOrder());
        existing.setActive(updated.getActive());
        existing.setStartDate(updated.getStartDate());
        existing.setEndDate(updated.getEndDate());
        existing.setShowPriceBadge(updated.getShowPriceBadge() != null ? updated.getShowPriceBadge() : true);
        existing.setPriceBadgePrefix(updated.getPriceBadgePrefix());
        existing.setPriceBadgeValue(updated.getPriceBadgeValue());
        return bannerRepository.save(existing);
    }

    public void delete(Integer id) {
        bannerRepository.deleteById(id);
    }
}
