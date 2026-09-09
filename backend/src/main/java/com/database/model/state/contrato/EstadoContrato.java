package com.database.model.state.contrato;

import com.database.model.Contrato;

public interface EstadoContrato {
    void assinar(Contrato contrato);
    void cancelar(Contrato contrato);
    void verificarExpiracao(Contrato contrato);
}
