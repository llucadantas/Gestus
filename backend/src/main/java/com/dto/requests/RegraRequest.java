package com.dto.requests;

import com.database.model.RegraPreco;
import com.database.model.enums.DiaSemana;
import com.database.model.enums.Mes;
import com.database.model.enums.Turno;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.Month;
import java.util.Set;

public record RegraRequest(
        @NotNull(message = "A descrição é obrigatoria")
        String descricao,
        @NotNull(message = "Valor é obrigatorio")
        BigDecimal valor,
        @NotNull(message = "Valor é obrigatorio")
        Set<DiaSemana> diasSemana,
        @NotNull(message = "Valor é obrigatorio")
        Set<Mes> meses
) {
}
