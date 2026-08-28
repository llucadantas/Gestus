package com.database.model.enums;

import java.time.DayOfWeek;

import static java.time.DayOfWeek.SUNDAY;
import static java.time.DayOfWeek.TUESDAY;

public enum DiaSemana {
    SEGUNDA,
    TERCA,
    QUARTA,
    QUINTA,
    SEXTA,
    SABADO,
    DOMINGO;
    public static DiaSemana converterDoJava(DayOfWeek diaJava) {
        return switch (diaJava) {
            case MONDAY -> SEGUNDA;
            case TUESDAY -> TERCA;
            case WEDNESDAY -> QUARTA;
            case THURSDAY -> QUINTA;
            case FRIDAY -> SEXTA;
            case SATURDAY -> SABADO;
            case SUNDAY -> DOMINGO;
        };
    }
}
