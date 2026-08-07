package com.dto.requests;

import jakarta.validation.constraints.NotBlank;
import jdk.jfr.Name;

public record TeatroRequest(

        @NotBlank(message = "Nome está vazio")
        String nome
)
{}
