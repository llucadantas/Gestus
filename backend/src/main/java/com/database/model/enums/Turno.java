package com.database.model.enums;

import lombok.Getter;

import java.time.LocalTime;

@Getter
public enum Turno {

    MANHA(LocalTime.of(8, 0), LocalTime.of(12, 0)),
    TARDE(LocalTime.of(13, 0), LocalTime.of(18, 0)),
    NOITE(LocalTime.of(19, 0), LocalTime.of(23, 0));

    private final LocalTime inicio;
    private final LocalTime fim;

    Turno(LocalTime inicio, LocalTime fim) {
        this.inicio = inicio;
        this.fim = fim;
    }


    public boolean contemHorario(LocalTime inicioOcupacao, LocalTime fimOcupacao) {
        return !inicioOcupacao.isBefore(this.inicio) && !fimOcupacao.isAfter(this.fim);
    }
}