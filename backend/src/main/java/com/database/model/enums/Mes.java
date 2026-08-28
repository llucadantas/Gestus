package com.database.model.enums;

import java.time.Month;

public enum Mes {
    JANEIRO,
    FEVEREIRO,
    MARCO,
    ABRIL,
    MAIO,
    JUNHO,
    JULHO,
    AGOSTO,
    SETEMBRO,
    OUTUBRO,
    NOVEMBRO,
    DEZEMBRO;

    public static Mes converterDoJava(Month mesJava) {
        return values()[mesJava.getValue() - 1];
    }
}
