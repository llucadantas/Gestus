package com.dto.response.dashboard;

import java.time.LocalDate;
import java.time.LocalTime;

public record SessaoDestaqueDto(
    String nomePeca,
    String nomeArtista,
    LocalDate data,
    LocalTime horario
) {}