package com.mapper;

import com.dto.AdministradorDto;
import com.model.Administrador;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface AdministradorMapper {
    AdministradorMapper INSTANCE = Mappers.getMapper(AdministradorMapper.class);
    AdministradorDto administradorDtoToAdministrador(Administrador administrador);
    Administrador administradorToAdministradorDto(AdministradorDto administradorDto);
}
