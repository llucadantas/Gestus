package com.services;


import com.database.model.*;
import com.database.dao.SessaoDao;
import com.dto.requests.ContratoAluguelRequest;
import com.dto.response.SessaoProjection;
import com.dto.response.SessaoResponse;
import com.exception.NotFoundException;
import com.exception.ValidacaoException;
import com.services.strategy.sessao.ValidadorSessao;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
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
        List<Sessao> sessoes = sessaoDao.findAllByPropostaAluguel_Teatro_Id(idTeatro);
        return sessoes.stream()
                .map(SessaoResponse::new)
                .toList();
    }

    public SessaoResponse getSessaoResponse(Long idSessao, Long idTeatro) throws NotFoundException {
        return new SessaoResponse(getSessao(idSessao, idTeatro));
    }

    private Sessao getSessao(Long idSessao, Long idTeatro) throws NotFoundException {
        return sessaoDao.findByIdAndPropostaAluguel_Teatro_Id(idSessao, idTeatro)
                .orElseThrow(()-> new NotFoundException("Sessao não encontrada"));
    }

    @Transactional
    public List<Sessao> cadastrarSessoes(ContratoAluguelRequest request, Teatro t, Aluguel aluguel) {
        List<Sessao> sessoes = new ArrayList<>();
        if (request.dataInicio() == null || request.dataFim() == null) {
            throw new ValidacaoException("As datas de início e fim do contrato são obrigatórias e devem estar no formato YYYY-MM-DD.");
        }
        List<LocalDate> diasDeExibicao = request.dataInicio()
                .datesUntil(request.dataFim().plusDays(1))
                .toList();

        for (LocalDate data : diasDeExibicao) {

            Sessao sessao = Sessao.builder()
                    .dataExibicao(data)
                    .propostaAluguel(aluguel)
                    .build();

            sessao.setHorarioInicioPeca(request.inicioPeca());
            sessao.setHorarioFimPeca(request.fimPeca());

            for (ValidadorSessao validador : validadores) {
                validador.validar(sessao, t.getId());
            }

            sessao.setValorSessao(calcularValorFinal(sessao, t.getId()));

            sessoes.add(sessao);
        }
        return sessoes;
    }

    public BigDecimal calcularValorFinal(Sessao s, Long idTeatro) {
        // Busca a regra aplicável (ex: R$ 100,00 por hora)
        BigDecimal valorDia = regraPrecoService.obterPrecoAplicavel(s.getDataExibicao(), idTeatro);

        // 1. Pega a duração exata em minutos
        long minutosOcupacao = Duration.between(s.getHorarioOcupacaoInicio(), s.getHorarioOcupacaoFim()).toMinutes();

        // 2. Converte para horas decimais (ex: 210 minutos / 60 = 3.5 horas)
        // O RoundingMode.HALF_UP garante que dízimas sejam arredondadas corretamente (ex: 3.33)
        BigDecimal horasFracionadas = BigDecimal.valueOf(minutosOcupacao)
                .divide(BigDecimal.valueOf(60), 2, RoundingMode.HALF_UP);

        // 3. Multiplica o valor do dia pela quantidade de horas exatas
        return valorDia.multiply(horasFracionadas);
    }

    public Page<SessaoProjection> sessoesRecentes(Long idTeatro, int pagina, int tamanho ) {
        return sessaoDao.buscarSessoesRecentes(idTeatro, pagina, tamanho);
    }


}
