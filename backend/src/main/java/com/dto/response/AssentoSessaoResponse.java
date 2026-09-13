package com.dto.response;

import com.database.model.AssentoSessao;

public record AssentoSessaoResponse(Long id, String codigoPosicao, boolean disponivel, String fileira) {
    public AssentoSessaoResponse(AssentoSessao a) {
        this(a.getId(), a.getCodigoPosicao(), a.isDisponivel(), a.getFileira());
    }
}
