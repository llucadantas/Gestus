package com.dto.requests;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalTime;

public record ContratoAluguelRequest(


        @NotNull(message = "A peça é obrigatória")
        Long idPeca,

        @NotNull(message = "O artista é obrigatório")
        @Email
        String emailArtista,

        @NotNull(message = "A data de inicio do contrato aluguel é obrigatória")
        LocalDate dataInicio,

        @NotNull(message = "A data do aluguel é obrigatória")
        LocalDate dataFim,

        @NotNull(message = "Horario de inicio é obrigatorio")
        LocalTime inicioPeca,

        @NotNull(message = "Horario de fim é obrigatorio")
        LocalTime fimPeca


) {}