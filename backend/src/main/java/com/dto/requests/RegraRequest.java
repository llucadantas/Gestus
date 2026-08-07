package com.dto.requests;

import com.database.model.enums.Turno;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.Month;
import java.util.Set;

public record RegraRequest(
        Set<DayOfWeek> dia,
        Set<Month> mes,
        Set<Turno> turno,
        BigDecimal valor
) {
}
