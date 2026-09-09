package com.services.strategy.sessao;

import com.database.model.Sessao;

import java.time.LocalDate;

public interface ValidadorRegra{
    void validar(LocalDate data, Long idTeatro);
}
