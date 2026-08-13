package com.dto.requests;

import com.database.model.enums.Turno;

import java.time.LocalDate;

public record SessaoRequest(LocalDate data, Turno turno) {
}
