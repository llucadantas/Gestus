package com.services.strategy.sessao;

import com.database.dao.RegraPrecoDao;
import com.database.model.RegraPreco;
import com.database.model.Sessao;
import com.exception.ValidacaoException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class ValidadorExisteRegra implements ValidadorRegra {

    private final RegraPrecoDao regraPrecoDao;


    @Override
    public void validar(LocalDate data, Long idTeatro) {
        List<RegraPreco> regras = regraPrecoDao.findAllByTeatro_Id(idTeatro);
        if(regras.isEmpty()){
            throw new ValidacaoException("Nenhuma Regra encontrada");
        }
        boolean existe = regras.stream().anyMatch(regra -> regra.isAplicavel(data));
        if(!existe){
            throw new ValidacaoException("Nenhuma Regra abrange essa data");
        }
    }
}
