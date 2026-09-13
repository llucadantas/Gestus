package com.dto.response.dashboard;

import com.database.model.enums.StatusContrato;
import java.math.BigDecimal;
import java.time.LocalDate;

public record AluguelRecenteDto(
    Long id,
    String nomePeca,
    LocalDate dataInicio,
    LocalDate dataFim,
    BigDecimal valor,
    String status
) {
    public AluguelRecenteDto(Long id, String nomePeca, LocalDate dataInicio, LocalDate dataFim, BigDecimal valor, StatusContrato status) {
        this(id, nomePeca, dataInicio, dataFim, valor, status != null ? status.name() : "");
    }
}