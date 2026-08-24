package com.services.strategy.sessao;

import com.database.model.Sessao;
import com.database.repository.SessaoDao;
import com.exception.ValidacaoException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalTime;

@Component
@RequiredArgsConstructor
public class ValidadorConflitoHorario implements ValidadorSessao {

    private final SessaoDao sessaoDao;

    @Override
    public void validar(Sessao sessao, Long idTeatro) {
        LocalTime ocupacaoInicio = sessao.getHorarioInicioPeca().minusHours(1);
        LocalTime ocupacaoFim = sessao.getHorarioFimPeca().plusHours(1);

        boolean temConflito = sessaoDao.existeConflitoHorario(
                idTeatro,
                sessao.getDataExibicao(),
                ocupacaoInicio,
                ocupacaoFim
        );

        if (temConflito) {
            throw new ValidacaoException(
                    String.format("Conflito de agenda: O teatro já possui uma reserva na data %s " +
                                    "que conflita com o horário solicitado (%s às %s).",
                            sessao.getDataExibicao(), ocupacaoInicio, ocupacaoFim)
            );
        }
    }
}