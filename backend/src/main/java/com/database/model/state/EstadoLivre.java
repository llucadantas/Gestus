package com.database.model.state;

import com.database.model.Assento;

public class EstadoLivre implements EstadoAssento {

    @Override
    public void ocupar(Assento assento) {
        assento.setEstadoAtual(new EstadoOcupado());
    }

    @Override
    public void liberar(Assento assento) {
        throw new IllegalStateException("Operação inválida: O assento já está livre.");
    }

    @Override
    public void inativar(Assento assento) {
        assento.setEstadoAtual(new EstadoInativo());
    }

    @Override
    public String getStatus() {
        return "LIVRE";
    }
}