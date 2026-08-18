package com.dto.requests;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record IngressoVendidoRequest(
        @NotNull(message = "O ID da sessão é obrigatório.")
        Long idSessao,

        @NotNull(message = "O ID do assento é obrigatório.")
        Long idAssento,

        @NotBlank(message = "O e-mail do comprador é obrigatório.")
        @Email(message = "Formato de e-mail inválido.")
        String email
) {}