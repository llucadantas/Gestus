package com.database.model.state.assento;

import com.database.model.Assento;

public interface EstadoAssento {
    void ocupar(Assento assento);
    void liberar(Assento assento);
    void inativar(Assento assento);
    String getStatus();
}