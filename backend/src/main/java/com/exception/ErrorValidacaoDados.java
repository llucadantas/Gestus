package com.exception;

import java.util.List;

public record ErrorValidacaoDados(
        int status,
        String erro,
        List<ErroCampo> erros
) {}
