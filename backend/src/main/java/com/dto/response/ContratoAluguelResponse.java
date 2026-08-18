package com.dto.response;

import com.database.model.Aluguel;
import com.services.AluguelService;

import java.time.LocalDate;

public record ContratoAluguelResponse(
        Long id,
        Long idRegraPreco,
        Long idPeca,
        Long idArtista,
        LocalDate data
) {
    // Construtor para facilitar a conversão da Entidade para DTO
    public ContratoAluguelResponse(Aluguel contrato) {
        this(
                contrato.getId(),
                contrato.getRegraPreco().getId(),
                contrato.getPeca().getId(),
                contrato.getArtista().getId(),
                contrato.getData()
        );
    }
}