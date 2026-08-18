package com.dto.response;

import com.database.model.Artista;

public record ArtistaResponse(
        Long id,
        String nome,
        String email
) {
    public ArtistaResponse(Artista artista) {
        this(artista.getId(), artista.getNome(), artista.getEmail());
    }
}