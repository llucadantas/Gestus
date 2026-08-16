package com.services;

import com.database.model.Assento;
import com.database.model.ColunaAssento;
import com.database.repository.AssentoDao;
import com.database.repository.ColunaAssentoDao;
import com.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AssentoService {
    private final AssentoDao assentoDao;
    private final ColunaAssentoService colunaAssentoService;

    public void excluirTodos(Long idTeatro){
        assentoDao.deleteByColunaAssento_Teatro_Id(idTeatro);
    }

    public List<Assento> getAssentos(Long idTeatro) {
        return assentoDao.findByColunaAssento_Teatro_Id(idTeatro);
    }

    public void criarAssentos(Long idTeatro) throws NotFoundException {
        excluirTodos(idTeatro);
        List<ColunaAssento> colunaAssentos = colunaAssentoService.getColunas(idTeatro);
        if(colunaAssentos.isEmpty()){
            throw new NotFoundException("Sem colunas cadastradas");
        }
        for(ColunaAssento colunaAssento : colunaAssentos) {
            for (int i = 1; i <= colunaAssento.getQntdAssentos(); i++) {
                Assento a = Assento.builder()
                        .nAssento(i)
                        .codigoPosicao(colunaAssento.getIdentificadorColuna() + "-" + i)
                        .build();
                colunaAssento.getAssentos().add(a);
            }
            colunaAssentoService.salvarColunaAssento(colunaAssento);
        }
    }
}
