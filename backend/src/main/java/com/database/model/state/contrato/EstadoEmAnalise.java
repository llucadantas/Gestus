package com.database.model.state.contrato;

import com.database.model.Contrato;
import com.database.model.Sessao;
import com.database.model.enums.StatusContrato;
import com.database.model.enums.StatusSessao;
import com.exception.ValidacaoException;

import java.time.LocalDate;

public class EstadoEmAnalise implements EstadoContrato {
    @Override
    public void assinar(Contrato contrato) {
        contrato.setStatus(StatusContrato.ATIVO);

        if(contrato.getSessoes() !=  null && !contrato.getSessoes().isEmpty()){
            for(Sessao sessao : contrato.getSessoes()){
                sessao.setStatusSessao(StatusSessao.CONFIRMADO);
            }
        }
    }

    @Override
    public void cancelar(Contrato contrato) {
        contrato.setStatus(StatusContrato.CANCELADO);

        if(contrato.getSessoes() !=  null && !contrato.getSessoes().isEmpty()){
            for(Sessao sessao : contrato.getSessoes()){
                sessao.setStatusSessao(StatusSessao.CANCELADO);
            }
        }
    }

    @Override
    public void verificarExpiracao(Contrato contrato) {
        LocalDate dataFim = contrato.getSessoes()
                .stream()
                .map(Sessao::getDataExibicao)
                .max(LocalDate::compareTo)
                .orElseThrow(()-> new ValidacaoException("Problema na verificacao das datas"));

        if (LocalDate.now().isAfter(dataFim)) {
            System.out.println("Prazo do aluguel chegou ao fim. Finalizando contrato...");
            contrato.setStatus(StatusContrato.FINALIZADO);
        }
    }
}
