package com.dto.response;

import com.database.model.Assento;

public record AssentoResponse(String codigoPosicao) {
    public AssentoResponse(Assento assento) {
        this(assento.getCodigoPosicao());
    }
}
