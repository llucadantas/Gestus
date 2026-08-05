package com.services;

import com.database.model.Administrador;
import com.database.model.Teatro;
import com.database.repository.AdministradorDao;
import com.database.repository.TeatroDao;
import com.dto.TeatroDto;
import com.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TeatroService {
    private final TeatroDao teatroDao;
    private final AdministradorDao administradorDao;

    public void cadastrarTeatro(TeatroDto teatro, Long idAdministrador) throws NotFoundException {
        Administrador administrador = administradorDao.findById(idAdministrador)
                .orElseThrow(() -> new NotFoundException("Administrador não encontrado."));
        Teatro teatroModel = Teatro.builder()
                .nome(teatro.nome())
                .administrador(administrador)
                .build();
        teatroDao.save(teatroModel);
    }

}