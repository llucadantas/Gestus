package com.services;

import com.database.model.Assento;
import com.database.model.Coluna;
import com.database.dao.AssentoDao;
import com.dto.response.AssentoResponse;
import com.exception.NotFoundException;
import lombok.Builder;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Builder
public class AssentoService {
    private final AssentoDao assentoDao;


    @Transactional(readOnly = true)
    public List<AssentoResponse> getAssentos(Long idTeatro) {
        return assentoDao.findAllByTeatroId(idTeatro)
                .stream()
                .map(AssentoResponse::new)
                .toList();
    }

    public List<Assento> getAssentosModel(Long idTeatro) {
        return assentoDao.findAllByTeatroId(idTeatro);
    }



//    @Transactional
//    public void criarAssentos(Long idTeatro) throws NotFoundException {
//        excluirTodos(idTeatro);
//
//        List<Coluna> colunas = colunaService.getColunas(idTeatro);
//        if (colunas == null || colunas.isEmpty()) {
//            throw new NotFoundException("Sem colunas cadastradas para o teatro ID: " + idTeatro);
//        }
//
//        List<Assento> novosAssentos = new ArrayList<>();
//
//        for (Coluna coluna : colunas) {
//            for (int i = 1; i <= coluna.getQntdAssento(); i++) {
//                novosAssentos.add(
//                        Assento.builder()
//                                .nAssento(i)
//                                .codigoPosicao(coluna.getIdentificadorColuna() + "-" + i)
//                                .coluna(coluna)
//                                .build()
//                );
//            }
//        }
//
//        assentoDao.saveAll(novosAssentos);
//    }


    @Transactional
    public List<Assento> criarAssentoColuna(Coluna c){
        List<Assento> assentos = new ArrayList<>();
        for (int i = 1; i <= c.getQntdAssento(); i++) {
            assentos.add(
                    Assento.builder()
                            .nAssento(i)
                            .codigoPosicao(c.getIdentificadorColuna() + "-" + i)
                            .coluna(c)
                            .build()
            );
        }
        return assentos;
    }

}
