package com.services;

import com.database.model.Assento;
import com.database.model.Coluna;
import com.database.repository.AssentoDao;
import com.dto.response.AssentoResponse;
import com.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AssentoService {
    private final AssentoDao assentoDao;
    private final ColunaService colunaService;


    @Transactional
    public void excluirTodos(Long idTeatro){
        assentoDao.deleteAllByColuna_Teatro_Id(idTeatro);
    }

    @Transactional(readOnly = true)
    public List<AssentoResponse> getAssentos(Long idTeatro) {
        return assentoDao.findAllByColuna_Teatro_Id(idTeatro)
                .stream()
                .map(AssentoResponse::new)
                .toList();
    }

    @Transactional
    public void criarAssentos(Long idTeatro) throws NotFoundException {
        excluirTodos(idTeatro);

        List<Coluna> colunas = colunaService.getColunas(idTeatro);
        if (colunas == null || colunas.isEmpty()) {
            throw new NotFoundException("Sem colunas cadastradas para o teatro ID: " + idTeatro);
        }

        List<Assento> novosAssentos = new ArrayList<>();

        for (Coluna coluna : colunas) {
            for (int i = 1; i <= coluna.getQntdAssento(); i++) {
                novosAssentos.add(
                        Assento.builder()
                                .nAssento(i)
                                .codigoPosicao(coluna.getIdentificadorColuna() + "-" + i)
                                .coluna(coluna)
                                .build()
                );
            }
        }

        assentoDao.saveAll(novosAssentos);
    }

}
