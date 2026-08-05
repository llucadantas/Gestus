package com.dto.requests;

import jakarta.validation.constraints.NotBlank;

public record RegisterRequest(

        @NotBlank(message = "O nome não pode estar em branco.")
        String nome,
        @NotBlank(message = "O email não pode estar em branco")
        String email,
        @NotBlank(message = "Senha vazia")
        String senha
) {
}
