package com.dto.response;

import com.database.model.IngressoVendido;

public record IngressoVendidoResponse(
        Long id,
        Long idSessao,
        Long idAssento,
        String email,
        String codigoPosicao
) {
    public IngressoVendidoResponse(IngressoVendido ingresso) {
        this(
                ingresso.getId(),
                ingresso.getSessao().getId(),
                ingresso.getAssentoSessao().getId(),
                ingresso.getEmail(),
                ingresso.getAssentoSessao().getCodigoPosicao());

    }
}