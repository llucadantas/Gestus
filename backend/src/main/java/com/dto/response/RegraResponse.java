package com.dto.response;

import com.database.model.RegraPreco;
import com.database.model.enums.Turno;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.Month;
import java.util.Set;

public record RegraResponse(
        Long id,
        Set<DayOfWeek> dia,
        Set<Month> mes,
        Set<Turno> turno,
        BigDecimal valor,
        Long idTeatro

) {
    public RegraResponse(RegraPreco regra) {
        this(
                regra.getId(),
                regra.getDiaSemana(),
                regra.getMes(),
                regra.getTurno(),
                regra.getPreco(),
                regra.getTeatro() != null ? regra.getTeatro().getId() : null
        );
    }
}
