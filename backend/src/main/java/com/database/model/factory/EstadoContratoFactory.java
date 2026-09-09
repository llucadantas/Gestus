package com.database.model.factory;

import com.database.model.enums.StatusContrato;
import com.database.model.state.contrato.EstadoAtivo;
import com.database.model.state.contrato.EstadoContrato;
import com.database.model.state.contrato.EstadoEmAnalise;

public class EstadoContratoFactory {

    public static EstadoContrato obterEstado(StatusContrato status) {

        return switch (status) {
            case EM_ANALISE -> new EstadoEmAnalise();
            case ATIVO -> new EstadoAtivo();
            case CANCELADO, FINALIZADO -> throw new IllegalStateException("Contrato em estado final não permite alterações.");
        };
    }
}
