package com.dto.response;

import com.database.model.Administrador;

public record UserResponse(Long id, String nome, String email, Long idTeatro) {
    public UserResponse(Administrador administrador) {
        this(
                administrador.getId(),
                administrador.getNome(),
                administrador.getEmail(),
                administrador.getTeatro().getId()
        );
    }
}
