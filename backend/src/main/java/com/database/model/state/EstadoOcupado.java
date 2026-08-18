package com.database.model.state;

import com.database.model.Assento;

public class EstadoOcupado implements EstadoAssento {

    @Override
    public void ocupar(Assento assento) {
        throw new IllegalStateException("Operação inválida: Este assento já está ocupado.");
    }

    @Override
    public void liberar(Assento assento) {
        assento.setEstadoAtual(new EstadoLivre());
    }

    @Override
    public void inativar(Assento assento) {
        throw new IllegalStateException("Operação inválida: Não é possível inativar um assento que está ocupado.");
    }

    @Override
    public String getStatus() {
        return "OCUPADO";
    }
}