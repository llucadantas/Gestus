package com.dto.response;

import com.database.model.Administrador;
import com.fasterxml.jackson.annotation.JacksonInject;

public record UserResponse(Long id, String nome, String email, Long idTeatro) {

    public UserResponse(Administrador administrador, Long idTeatro) {
        this(
                administrador.getId(),
                administrador.getNome(),
                administrador.getEmail(),
                idTeatro
        );
    }
}
