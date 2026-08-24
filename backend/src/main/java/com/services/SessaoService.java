package com.services;


import com.database.model.*;
import com.database.repository.SessaoDao;
import com.dto.requests.ContratoAluguelRequest;
import com.dto.response.SessaoProjection;
import com.dto.response.SessaoResponse;
import com.exception.NotFoundException;
import com.services.strategy.sessao.ValidadorSessao;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SessaoService {
    private final SessaoDao sessaoDao;
    private final RegraPrecoService regraPrecoService;
    private final List<ValidadorSessao> validadores;


    public List<SessaoResponse> getSessoes(Long idTeatro){
        List<Sessao> sessoes = sessaoDao.findAllByPeca_Teatro_Id(idTeatro);
        return sessoes.stream()
                .map(SessaoResponse::new)
                .toList();
    }

    public SessaoResponse getSessaoResponse(Long idSessao, Long idTeatro) throws NotFoundException {
        return new SessaoResponse(getSessao(idSessao, idTeatro));
    }

    private Sessao getSessao(Long idSessao, Long idTeatro) throws NotFoundException {
        return sessaoDao.findByIdAndPeca_Teatro_Id(idSessao, idTeatro)
                .orElseThrow(()-> new NotFoundException("Sessao não encontrada"));
    }

    @Transactional
    public List<Sessao> cadastrarSessoes(ContratoAluguelRequest request, Teatro t) {
        List<Sessao> sessoes = new ArrayList<>();
        List<LocalDate> diasDeExibicao = request.dataInicio()
                .datesUntil(request.dataFim().plusDays(1))
                .toList();

        for (LocalDate data : diasDeExibicao) {

            Sessao sessao = Sessao.builder()
                    .dataExibicao(data)
                    .horarioInicioPeca(request.inicioPeca())
                    .horarioFimPeca(request.fimPeca())
                    .build();

            for (ValidadorSessao validador : validadores) {
                validador.validar(sessao, t.getId());
            }

            BigDecimal valorSessao = regraPrecoService.obterPrecoAplicavel(data, t.getId());
            sessao.setValorSessao(valorSessao);

            sessoes.add(sessao);
        }
        return sessoes;
    }

    public List<SessaoProjection> sessoesRecentes(Long idTeatro, Pageable pageable) {
        return sessaoDao.buscarSessoesRecentes(idTeatro, pageable);
    }


}
