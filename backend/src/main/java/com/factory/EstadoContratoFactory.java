package com.factory;

import com.database.model.enums.StatusContrato;
import com.database.model.state.contrato.EstadoAtivo;
import com.database.model.state.contrato.EstadoContrato;
import com.database.model.state.contrato.EstadoEmAnalise;
import com.services.AssentoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
public class EstadoContratoFactory {
    private final AssentoService assentoService;

    // O método deixa de ser estático
    public EstadoContrato obterEstado(StatusContrato status) {
        return switch (status) {
            case EM_ANALISE -> new EstadoEmAnalise(assentoService);
            case ATIVO -> new EstadoAtivo();
            case CANCELADO, FINALIZADO -> throw new IllegalStateException("Contrato em estado final não permite alterações.");
        };
    }
}