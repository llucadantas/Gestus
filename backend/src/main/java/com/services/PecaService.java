package com.services;

import com.database.model.Peca;
import com.database.dao.PecaDao;
import com.dto.requests.PecaRequest;
import com.dto.response.PecaResponse;
import com.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PecaService {
    private final PecaDao pecaDao;
    public List<PecaResponse> listarPecas(){
        return pecaDao.findAll()
                .stream()
                .map(PecaResponse::new)
                .toList();
    }

    public Peca buscarPeca(Long idPeca) throws NotFoundException {
        return pecaDao.findById(idPeca)
                .orElseThrow(()-> new NotFoundException("Peca não existe"));
    }

    @Transactional
    public Peca cadastrarPeca(PecaRequest peca) throws NotFoundException {
        Peca p = Peca.builder()
                .nome(peca.nome())
                .descricao(peca.descricao())
                .build();
        pecaDao.save(p);
        return p;
    }
}


