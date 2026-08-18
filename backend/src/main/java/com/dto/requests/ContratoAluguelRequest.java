package com.dto.requests;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record ContratoAluguelRequest(
        @NotNull(message = "A regra de preço é obrigatória")
        Long idRegraPreco,

        @NotNull(message = "A peça é obrigatória")
        Long idPeca,

        @NotNull(message = "O artista é obrigatório")
        Long idArtista,

        @NotNull(message = "A data do aluguel é obrigatória")
        LocalDate data
) {}