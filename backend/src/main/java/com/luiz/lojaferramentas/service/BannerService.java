package com.luiz.lojaferramentas.service;

import com.luiz.lojaferramentas.domain.Banner;
import com.luiz.lojaferramentas.dto.BannerDTO;
import com.luiz.lojaferramentas.dto.BannerRequestDTO;
import com.luiz.lojaferramentas.exception.ResourceNotFoundException;
import com.luiz.lojaferramentas.mapper.BannerMapper;
import com.luiz.lojaferramentas.repository.BannerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BannerService {

    private final BannerRepository bannerRepository;
    private final BannerMapper bannerMapper;

    public List<BannerDTO> listAll() {
        return bannerMapper.toDtoList(bannerRepository.findAllByOrderByDisplayOrderAsc());
    }

    public List<BannerDTO> listActive() {
        return bannerMapper.toDtoList(bannerRepository.findByActiveTrueOrderByDisplayOrderAsc());
    }

    public BannerDTO getById(Integer id) {
        return bannerMapper.toDto(findBannerById(id));
    }

    @PreAuthorize("hasRole('ADMIN')")
    public BannerDTO create(BannerRequestDTO request) {
        Banner banner = bannerMapper.toEntity(request);
        banner.setId(null);
        banner.setShowPriceBadge(request.showPriceBadge() != null ? request.showPriceBadge() : true);
        return bannerMapper.toDto(bannerRepository.save(banner));
    }

    @PreAuthorize("hasRole('ADMIN')")
    public BannerDTO update(Integer id, BannerRequestDTO request) {
        Banner existing = findBannerById(id);
        existing.setTitle(request.title());
        existing.setSubtitle(request.subtitle());
        existing.setImageUrl(request.imageUrl());
        existing.setLinkUrl(request.linkUrl());
        existing.setDisplayOrder(request.displayOrder());
        existing.setActive(request.active());
        existing.setStartDate(request.startDate());
        existing.setEndDate(request.endDate());
        existing.setShowPriceBadge(request.showPriceBadge() != null ? request.showPriceBadge() : true);
        existing.setPriceBadgePrefix(request.priceBadgePrefix());
        existing.setPriceBadgeValue(request.priceBadgeValue());
        return bannerMapper.toDto(bannerRepository.save(existing));
    }

    @PreAuthorize("hasRole('ADMIN')")
    public void delete(Integer id) {
        Banner existing = findBannerById(id);
        bannerRepository.delete(existing);
    }

    private Banner findBannerById(Integer id) {
        return bannerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Banner nao encontrado: " + id));
    }
}
