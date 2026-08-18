package com.database.model.state;

import com.database.model.Assento;

public class EstadoInativo implements EstadoAssento {

    @Override
    public void ocupar(Assento assento) {
        throw new IllegalStateException("Operação inválida: Não é possível ocupar um assento inativo (em manutenção).");
    }

    @Override
    public void liberar(Assento assento) {
        // Ao realizar a manutenção do assento, ele volta a ficar livre
        assento.setEstadoAtual(new EstadoLivre());
    }

    @Override
    public void inativar(Assento assento) {
        throw new IllegalStateException("Operação inválida: O assento já está inativo.");
    }

    @Override
    public String getStatus() {
        return "INATIVO";
    }
}