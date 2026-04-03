package com.luiz.lojaferramentas.mapper;

import com.luiz.lojaferramentas.domain.AdminUser;
import com.luiz.lojaferramentas.dto.AdminUserDTO;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface AdminUserMapper {

    AdminUserDTO toDto(AdminUser adminUser);
}
