package com.services;

import com.database.model.Administrador;
import com.database.model.Teatro;
import com.database.dao.AdministradorDao;
import com.database.dao.TeatroDao;
import com.dto.requests.TeatroRequest;
import com.dto.response.TeatroResponse;
import com.exception.NotFoundException;
import com.exception.TeatroCadastroException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TeatroService {
    private final TeatroDao teatroDao;
    private final AdministradorDao administradorDao;

    @Transactional
    public void cadastrarTeatro(String nome, Administrador administrador) throws TeatroCadastroException {
        if(administrador.getTeatro() != null) {
            throw new TeatroCadastroException("Teatro já cadastrado");
        }

        Teatro teatroModel = Teatro.builder()
                .nome(nome)
                .administrador(administrador)
                .build();
        teatroDao.save(teatroModel);
    }

    @Transactional
    public void atualizarTeatro(TeatroRequest teatroRequest, Long idTeatro) throws NotFoundException {
        Teatro t = getTeatro(idTeatro);
        t.setNome(teatroRequest.nome());
        teatroDao.save(t);
    }

    public Teatro getTeatro(Long idTeatro) throws NotFoundException {
        if(idTeatro == null) {
            throw new NotFoundException("Teatro não cadastrado");
        }
        Teatro teatro = teatroDao.findById(idTeatro);
        if (teatro == null) {
            throw new NotFoundException("Teatro não encontrado");
        }
        return teatro;
    }

    public TeatroResponse getTeatroResponse(Long id) throws NotFoundException {
        return teatroDao.findByIdResponse(id);
}}