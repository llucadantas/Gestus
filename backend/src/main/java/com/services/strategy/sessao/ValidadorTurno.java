package com.services.strategy.sessao;

import com.database.model.Sessao;
import com.database.model.enums.Turno;
import com.exception.ValidacaoException;
import org.springframework.stereotype.Component;

import java.time.LocalTime;

@Component
public class ValidadorTurno implements ValidadorSessao {

    @Override
    public void validar(Sessao sessao, Long idTeatro) {
        LocalTime ocupacaoInicio = sessao.getHorarioInicioPeca().minusHours(1);
        LocalTime ocupacaoFim = sessao.getHorarioFimPeca().plusHours(1);

        if (ocupacaoFim.isBefore(ocupacaoInicio)) {
            throw new ValidacaoException("O horário de ocupação não pode ultrapassar o mesmo dia.");
        }

        boolean cabeEmAlgumTurno = false;

        for (Turno turno : Turno.values()) {
            if (turno.contemHorario(ocupacaoInicio, ocupacaoFim)) {
                cabeEmAlgumTurno = true;
                break;
            }
        }

        if (!cabeEmAlgumTurno) {
            throw new ValidacaoException(
                    String.format("O período de ocupação (%s às %s) ultrapassa os limites de um único turno " +
                                    "(Manhã: 08h-12h, Tarde: 13h-18h, Noite: 19h-23h).",
                            ocupacaoInicio, ocupacaoFim)
            );
        }
    }
}
