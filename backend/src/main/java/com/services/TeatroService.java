package com.services;

import com.database.model.Administrador;
import com.database.model.Teatro;
import com.database.repository.AdministradorDao;
import com.database.repository.TeatroDao;
import com.dto.requests.TeatroRequest;
import com.dto.response.TeatroResponse;
import com.exception.NotFoundException;
import com.exception.TeatroCadastroException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TeatroService {
    private final TeatroDao teatroDao;
    private final AdministradorDao administradorDao;

    public void cadastrarTeatro(TeatroRequest teatro, Long idAdm) throws NotFoundException, TeatroCadastroException {
        Administrador administrador = administradorDao.findById(idAdm)
                .orElseThrow(()->new NotFoundException("Adm nãq encontrado"));

        if(administrador.getTeatro() != null) {
            throw new TeatroCadastroException("Teatro já cadastrado");
        }

        Teatro teatroModel = Teatro.builder()
                .nome(teatro.nome())
                .administrador(administrador)
                .build();
        teatroDao.save(teatroModel);
    }

    public void atualizarTeatro(TeatroRequest teatroRequest, Long idTeatro) throws NotFoundException {
        Teatro t = getTeatro(idTeatro);
        t.setNome(teatroRequest.nome());
        teatroDao.save(t);
    }

    public Teatro getTeatro(Long idTeatro) throws NotFoundException {
        if(idTeatro == null) {
            throw new NotFoundException("Teatro não cadastrado");
        }
        return teatroDao.findById(idTeatro)
                .orElseThrow(()-> new NotFoundException("Teatro não encontrado."));
    }

    public TeatroResponse getTeatroResponse(Long id) throws NotFoundException {
        Teatro t = getTeatro(id);
        return new TeatroResponse(t.getId(), t.getNome(), t.getAdministrador().getId());
    }

}