package com.services.strategy.sessao;

import com.database.dao.AssentoDao;
import com.database.model.Coluna;
import com.dto.requests.ContratoAluguelRequest;
import com.services.ColunaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class ValidadorAssentosContrato implements ValidadorContrato{

    private final ColunaService coluna;

    @Override
    public void validar(ContratoAluguelRequest request) {

    }
}
