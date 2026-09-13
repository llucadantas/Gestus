package com.database.model.state.contrato;

import com.database.model.Contrato;
import com.database.model.Sessao;
import com.database.model.enums.StatusContrato;
import com.exception.ValidacaoException;

import java.time.LocalDate;

public class EstadoAtivo implements EstadoContrato{

    @Override
    public void assinar(Contrato contrato) {
        throw new IllegalStateException("Contrato já está ativo. Não pode ser assinado novamente.");
    }

    @Override
    public void cancelar(Contrato contrato) {
        if(contrato.getStatus().equals(StatusContrato.ATIVO)){
            throw new IllegalStateException("Contrato ativo, não pode ser cancelado");
        }
        contrato.getSessoes().clear();
        contrato.setStatus(StatusContrato.CANCELADO);
    }

    @Override
    public void verificarExpiracao(Contrato contrato) {
        LocalDate dataFim = contrato.getSessoes()
                .stream()
                .map(Sessao::getDataExibicao)
                .max(LocalDate::compareTo)
                .orElseThrow(()-> new ValidacaoException("Problema na verificacao das datas"));

        if (LocalDate.now().isAfter(dataFim)) {
            contrato.setStatus(StatusContrato.FINALIZADO);
        }
    }
}
