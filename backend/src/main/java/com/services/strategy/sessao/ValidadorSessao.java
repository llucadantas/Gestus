package com.services.strategy.sessao;

import com.database.model.Sessao;

public interface ValidadorSessao {
    void validar(Sessao sessao, Long idTeatro);
}
