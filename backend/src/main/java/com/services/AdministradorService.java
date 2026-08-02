package com.services;


import com.dto.AdministradorDto;
import com.mapper.AdministradorMapper;
import com.model.Administrador;
import com.repository.AdministradorDao;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdministradorService {
    private final AdministradorDao administradorDao;

    public void CadastrarAdministrador(AdministradorDto administradorDto) {
        Administrador administrador = AdministradorMapper.INSTANCE.administradorToAdministradorDto(administradorDto);
        administradorDao.save(administrador);
    }

    public AdministradorDto getAdministradorById(Long id) {
        Administrador administrador = administradorDao.findById(id).orElseThrow();
        return AdministradorMapper.INSTANCE.administradorDtoToAdministrador(administrador);
    }

    public List<AdministradorDto> getAllAdministradores() {
        List<AdministradorDto> adms = new ArrayList<>();
        for(Administrador administrador : administradorDao.findAll()) {
            adms.add(AdministradorMapper.INSTANCE.administradorDtoToAdministrador(administrador));
        }
        return adms;
    }

    public void deletarAdm(Long id){
        administradorDao.deleteById(id);
    }
}
