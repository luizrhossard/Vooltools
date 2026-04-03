package com.luiz.lojaferramentas.mapper;

import com.luiz.lojaferramentas.domain.Banner;
import com.luiz.lojaferramentas.dto.BannerDTO;
import com.luiz.lojaferramentas.dto.BannerRequestDTO;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface BannerMapper {

    BannerDTO toDto(Banner banner);

    List<BannerDTO> toDtoList(List<Banner> banners);

    @Mapping(target = "id", ignore = true)
    Banner toEntity(BannerRequestDTO request);
}
