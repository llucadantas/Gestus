package com.services;


import com.dto.response.AdministradorResponse;
import com.exception.NotFoundException;
import com.database.dao.AdministradorDao;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdministradorService {
    private final AdministradorDao administradorDao;

    public AdministradorResponse getAdministradorById(Long id) throws NotFoundException {
        return administradorDao.findByIdResponse(id)
                .orElseThrow(()-> new NotFoundException("Administrador não encontrado."));
    }

}
