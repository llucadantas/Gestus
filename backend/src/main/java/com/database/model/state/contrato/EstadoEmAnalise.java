package com.database.model.state.contrato;

import com.database.model.Assento;
import com.database.model.AssentoSessao;
import com.database.model.Contrato;
import com.database.model.Sessao;
import com.database.model.enums.StatusContrato;
import com.database.model.enums.StatusSessao;
import com.exception.ValidacaoException;
import com.services.AssentoService;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
public class EstadoEmAnalise implements EstadoContrato {

    private final AssentoService assentoService;

    public void assinar(Contrato contrato) {
        contrato.setStatus(StatusContrato.ATIVO);

        if (contrato.getSessoes() != null && !contrato.getSessoes().isEmpty()) {
            List<Assento> assentosBase = assentoService.getAssentosModel(contrato.getTeatro().getId());

            for (Sessao sessao : contrato.getSessoes()) {
                sessao.setStatusSessao(StatusSessao.CONFIRMADO);

                // 1. Expandimos o map para poder vincular a sessão ao assento
                List<AssentoSessao> assentosSessaoDaVez = assentosBase.stream()
                        .map(assento -> {
                            AssentoSessao novoAssento = new AssentoSessao(assento);
                            // AQUI ESTÁ A MÁGICA: O Hibernate precisa disso para preencher o ID!
                            novoAssento.setSessao(sessao);
                            return novoAssento;
                        })
                        .toList(); // Usamos collect em vez de toList() por segurança

                sessao.getAssentosSessao().addAll(assentosSessaoDaVez);
            }
        }
    }

    @Override
    public void cancelar(Contrato contrato) {
        contrato.setStatus(StatusContrato.CANCELADO);

        if (contrato.getSessoes() != null && !contrato.getSessoes().isEmpty()) {
            contrato.getSessoes().forEach(sessao -> sessao.setStatusSessao(StatusSessao.CANCELADO));
        }
    }

    @Override
    public void verificarExpiracao(Contrato contrato) {
        LocalDate dataFim = contrato.getSessoes()
                .stream()
                .map(Sessao::getDataExibicao)
                .max(LocalDate::compareTo)
                .orElseThrow(() -> new ValidacaoException("Problema na verificação das datas"));

        if (LocalDate.now().isAfter(dataFim)) {
            log.info("Prazo do aluguel do contrato ID {} chegou ao fim. Finalizando contrato...", contrato.getId());
            contrato.setStatus(StatusContrato.FINALIZADO);
        }
    }
}