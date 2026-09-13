package com.dto.response;

import com.database.model.AssentoSessao;
import com.database.model.Sessao;
import com.database.model.enums.Turno;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public record SessaoResponse(
        Long id,
        LocalDate data,
        LocalTime horarioInicio,
        LocalTime horarioFim,
        BigDecimal valorIngresso,
        String nomePeca,
        List<AssentoSessaoResponse> assentos // <- Agora é uma lista de DTOs!
) {
    public SessaoResponse(Sessao s){
        this(
                s.getId(),
                s.getDataExibicao(),
                s.getHorarioInicioPeca(),
                s.getHorarioFimPeca(),
                s.getValorIngresso(),
                s.getPropostaContrato().getPeca().getNome(),
                s.getAssentosSessao().stream().map(AssentoSessaoResponse::new).toList() // Converte a lista
        );
    }
}