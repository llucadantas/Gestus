package com.dto.response;

import com.database.model.Peca;

public record PecaResponse(Long id, String nome, String descricao) {

    public PecaResponse(Peca p) {
        this(p.getId(), p.getNome(), p.getDescricao());
    }
}
