package com.dto.requests;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ArtistaRequest(
        @NotBlank(message = "O nome do artista é obrigatório")
        String nome,

        @NotBlank(message = "O e-mail do artista é obrigatório")
        @Email(message = "Formato de e-mail inválido")
        String email
) {}
