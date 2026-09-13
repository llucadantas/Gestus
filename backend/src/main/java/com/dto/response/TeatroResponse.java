package com.dto.response;

import com.database.model.Teatro;

public record TeatroResponse(Long idTeatro, String nome, Long idAdministrador) {
    public TeatroResponse(Teatro t){
        this(
                t.getId(),
                t.getNome(),
                t.getAdministrador().getId()
        );
    }
}
