package com.dto.response;

import com.database.model.Contrato;
import com.database.model.Sessao;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ContratoAluguelResponse(
        Long id,
        BigDecimal valor,
        String nomePeca,
        String nomeArtista,
        LocalDate dataInicio,
        LocalDate dataFim,
        String status
) {
    public ContratoAluguelResponse(Contrato contrato) {
        this(
                contrato.getId(),
                contrato.getValorTotal(),
                contrato.getPeca().getNome(),
                contrato.getArtista().getNome(),

                // Troca o orElseThrow por orElse(null)
                contrato.getSessoes() == null ? null : contrato.getSessoes()
                        .stream()
                        .map(Sessao::getDataExibicao)
                        .min(LocalDate::compareTo)
                        .orElse(null),

                // Troca o orElseThrow por orElse(null)
                contrato.getSessoes() == null ? null : contrato.getSessoes()
                        .stream()
                        .map(Sessao::getDataExibicao)
                        .max(LocalDate::compareTo)
                        .orElse(null),

                contrato.getStatus().toString()
        );
    }
}