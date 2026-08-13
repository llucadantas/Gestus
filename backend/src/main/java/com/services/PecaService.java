package com.services;

import com.database.model.Peca;
import com.database.model.Teatro;
import com.database.repository.PecaDao;
import com.database.repository.TeatroDao;
import com.dto.requests.PecaRequest;
import com.dto.response.PecaResponse;
import com.dto.response.RegraResponse;
import com.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PecaService {
    private final PecaDao pecaDao;
    private final TeatroDao teatroDao;

    public List<PecaResponse> listarPecas(Long idTeatro){
        return pecaDao.findAllByTeatro_id(idTeatro)
                .stream()
                .map(PecaResponse::new)
                .toList();
    }

    public PecaResponse bucarPeca(Long idPeca, Long idTeatro) throws NotFoundException {
        return new PecaResponse(pecaDao.findByIdAndTeatro_id(idPeca, idTeatro)
                .orElseThrow(()-> new NotFoundException("Peca não existe")));
    }

    public void cadastrarPeca(PecaRequest peca, Long idTeatro) throws NotFoundException {
        if(idTeatro==null){
            throw new NotFoundException("Teatro não existe");
        }
        Teatro t = teatroDao.findById(idTeatro)
                .orElseThrow(()-> new NotFoundException("Teatro não existe"));
        pecaDao.save(Peca
                        .builder()
                        .nome(peca.nome())
                        .descricao(peca.descricao())
                        .teatro(t)
                        .build());
    }

    public void atualizarPeca(Long idPeca,PecaRequest peca, Long idTeatro) throws NotFoundException {
        Peca p = getPeca(idTeatro, idPeca);
        p.setDescricao(peca.descricao());
        p.setNome(peca.nome());
        pecaDao.save(p);
    }

    public void deletarPeca(Long idPeca, Long idTeatro) throws NotFoundException {
        Peca p = getPeca(idTeatro, idPeca);
        pecaDao.deleteById(p.getId());
    }

    public Peca getPeca(Long idTeatro,Long idPeca) throws NotFoundException {
        if(idTeatro==null){
            throw new NotFoundException("Teatro não existe");
        }
        return pecaDao.findByIdAndTeatro_id(idPeca, idTeatro)
                .orElseThrow(()->new NotFoundException("Peca não existe"));
    }

}
