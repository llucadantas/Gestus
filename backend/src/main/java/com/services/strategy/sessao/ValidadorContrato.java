package com.services.strategy.sessao;

import com.dto.requests.ContratoAluguelRequest;

public interface ValidadorContrato {
    void validar(ContratoAluguelRequest request);
}
