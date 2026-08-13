package com.services;


import com.database.model.Peca;
import com.database.model.Sessao;
import com.database.repository.SessaoDao;
import com.dto.requests.SessaoRequest;
import com.dto.response.SessaoResponse;
import com.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SessaoService {
    private final SessaoDao sessaoDao;
    private final PecaService pecaService;

    public void cadastrarSessao(SessaoRequest sessao, Long idTeatro, Long idPeca) throws NotFoundException {
        Peca p = pecaService.getPeca(idTeatro, idPeca);
        sessaoDao.save(Sessao.builder()
                        .data(sessao.data())
                        .turno(sessao.turno())
                        .peca(p)
                .build());
    }

    public List<SessaoResponse> getSessoes(Long idTeatro){
        List<Sessao> sessoes = sessaoDao.findAllByPeca_Teatro_Id(idTeatro);
        return sessoes.stream()
                .map(SessaoResponse::new)
                .toList();
    }

    public void deleteSesao(Long idTeatro, Long idSessao) {
        sessaoDao.deleteByIdAndPeca_Teatro_Id(idSessao, idTeatro);
    }

    public void atualizarSessao(SessaoRequest sessao, Long idTeatro, Long idSessao) throws NotFoundException {
        Sessao s = getSessao(idSessao, idTeatro);
        s.setData(sessao.data());
        s.setTurno(sessao.turno());
        sessaoDao.save(s);
    }

    public SessaoResponse getSessaoResponse(Long idSessao, Long idTeatro) throws NotFoundException {
        return new SessaoResponse(getSessao(idSessao, idTeatro));
    }

    private Sessao getSessao(Long idSessao, Long idTeatro) throws NotFoundException {
        return sessaoDao.findByIdAndPeca_Teatro_Id(idSessao, idTeatro)
                .orElseThrow(()-> new NotFoundException("Sessao não encontrada"));
    }


}
