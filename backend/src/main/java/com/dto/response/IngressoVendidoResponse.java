package com.dto.response;

import com.database.model.IngressoVendido;

public record IngressoVendidoResponse(
        Long id,
        Long idSessao,
        Long idAssento,
        String email,
        Integer numeroAssento,
        String codigoPosicao
) {
    public IngressoVendidoResponse(IngressoVendido ingresso) {
        this(
                ingresso.getId(),
                ingresso.getSessao().getId(),
                ingresso.getAssento().getId(),
                ingresso.getEmail(),
                ingresso.getAssento().getNAssento(),
                ingresso.getAssento().getCodigoPosicao()
        );
    }
}