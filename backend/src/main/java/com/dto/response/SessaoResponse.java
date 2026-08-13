package com.dto.response;

import com.database.model.Sessao;
import com.database.model.enums.Turno;

import java.time.LocalDate;

public record SessaoResponse(Long id, LocalDate data, Turno turno, Long idPeca) {

    public SessaoResponse(Sessao s){
        this(s.getId(), s.getData(), s.getTurno(), s.getPeca().getId());
    }
}
