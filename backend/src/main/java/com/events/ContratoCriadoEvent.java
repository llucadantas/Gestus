package com.events;

public record ContratoCriadoEvent(
    String emailArtista,
    String nomeArtista,
    String nomePeca,
    String tokenAssinatura
) {}