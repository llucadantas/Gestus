package com.dto.response;

import com.database.model.Sessao;
import com.database.model.enums.Turno;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public record SessaoResponse(Long id, LocalDate data, LocalTime horarioInicio, LocalTime horarioFim,BigDecimal valorIngresso) {

    public SessaoResponse(Sessao s){
        this(s.getId(), s.getDataExibicao(), s.getHorarioInicioPeca(), s.getHorarioFimPeca(), s.getValorIngresso());
    }
}
