package com.services.strategy.sessao;

import com.dto.requests.ContratoAluguelRequest;
import com.exception.ValidacaoException;

import java.time.LocalDate;

public class ValidadorDatasContrato implements ValidadorContrato {
    @Override
    public void validar(ContratoAluguelRequest request) {
        if(request.dataInicio().isBefore(LocalDate.now())){
            throw new ValidacaoException("Data de inicio inválida.");
        }
        if(!request.dataFim().isBefore(LocalDate.now()) || request.dataFim().isBefore(request.dataInicio())){
            throw new ValidacaoException("Data de encerramento inválida");
        }
    }
}
