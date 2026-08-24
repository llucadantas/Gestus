package com.services;

import com.database.model.Aluguel;
import com.database.model.Peca;
import com.database.model.Teatro;
import com.database.repository.PecaDao;
import com.database.repository.TeatroDao;
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

    public PecaResponse buscarPeca(Long idPeca) throws NotFoundException {
        return new PecaResponse(pecaDao.findById(idPeca)
                .orElseThrow(()-> new NotFoundException("Peca não existe")));
    }

    @Transactional
    public void cadastrarPeca(PecaRequest peca) throws NotFoundException {
        pecaDao.save(Peca
                .builder()
                .nome(peca.nome())
                .descricao(peca.descricao())
                .build());
    }
}


