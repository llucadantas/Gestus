package com.dto.response;

import com.database.model.RegraPreco;
import com.database.model.enums.DiaSemana;
import com.database.model.enums.Mes;
import com.database.model.enums.Turno;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.Month;
import java.util.Set;

public record RegraResponse(
        Long id,
        Set<DiaSemana> diasSemana,
        Set<Mes> meses,
        BigDecimal valor,
        String descricao,
        Long idTeatro

) {
    public RegraResponse(RegraPreco regra) {
        this(
                regra.getId(),
                regra.getDiasSemana(),
                regra.getMeses(),
                regra.getValor(),
                regra.getDescricao(),
                regra.getTeatro().getId()
        );
    }

}
