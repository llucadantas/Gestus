package com.dto.response;

import java.time.LocalDate;
import java.time.LocalTime;

public record SessaoProjection(String nomePeca,
                               LocalTime horarioInicioPeca,
                               LocalTime horarioFimPeca,
                               LocalDate data,
                               String nomeArtista
) {
}
