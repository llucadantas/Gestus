package com.dto.requests;

import com.database.model.enums.Turno;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.Month;
import java.util.Set;

public record RegraRequest(
        Set<DayOfWeek> dia,
        Set<Month> mes,
        Set<Turno> turno,
        @NotNull(message = "Valor é obrigatorio")
        BigDecimal valor
) {
}
