package com.database.model.factory;

import com.database.model.enums.StatusContrato;
import com.database.model.state.contrato.EstadoAtivo;
import com.database.model.state.contrato.EstadoContrato;
import com.database.model.state.contrato.EstadoEmAnalise;
import com.services.AssentoService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;


@Component // Transforma a Factory em um Bean gerenciado pelo Spring
@RequiredArgsConstructor // Injeta o service automaticamente
public class EstadoContratoFactory {

    // O Spring vai injetar o Service real (com repositórios, transações, etc.)
    private final AssentoService assentoService;

    // O método deixa de ser estático
    public EstadoContrato obterEstado(StatusContrato status) {
        return switch (status) {
            case EM_ANALISE -> new EstadoEmAnalise(assentoService); // Passa o service real!
            case ATIVO -> new EstadoAtivo();
            case CANCELADO, FINALIZADO -> throw new IllegalStateException("Contrato em estado final não permite alterações.");
        };
    }
}