package com.exception;

public record ErroCampo(
        String campo,
        String mensagem
) {
}
