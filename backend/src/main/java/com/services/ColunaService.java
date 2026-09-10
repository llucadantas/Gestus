package com.services;

import com.database.model.Assento;
import com.database.model.Coluna;
import com.database.dao.ColunaAssentoDao;
import com.dto.requests.ColunaRequest;
import com.dto.response.ColunaResponse;
import com.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ColunaService {
    private final ColunaAssentoDao colunaAssentoDao;
    private final TeatroService teatroService;
    private final AssentoService assentoService;


    public ColunaResponse criarColuna(ColunaRequest colunaRequest, Long idTeatro) throws NotFoundException {
        Coluna coluna = Coluna.builder()
                .qntdAssento(colunaRequest.qntd())
                .identificadorColuna(colunaRequest.identificador())
                .teatro(teatroService.getTeatro(idTeatro))
                .build();
        List<Assento> a = assentoService.criarAssentoColuna(coluna);
        coluna.setAssentos(a);
        colunaAssentoDao.save(coluna);
        return new ColunaResponse(coluna);
    }
//
//    @Transactional
//    public void salvarColunas(Set<ColunaRequest> colunasRequest, Long idTeatro) throws NotFoundException {
//        for (ColunaRequest colunaRequest : colunasRequest) {
//            Coluna c = Coluna.builder()
//                    .identificadorColuna(colunaRequest.identificador())
//                    .qntdAssento(colunaRequest.qntd())
//                    .teatro(teatroService.getTeatro(idTeatro))
//                    .build();
//            colunaAssentoDao.save(assentoService.criarAssentoColuna(c));
//        }
//    }

    //APAGAR PELO IDENTIFICADOR (ATUALIZAR)
    public void apagarColuna(Long idTeatro, Long idColuna) throws NotFoundException {
        Coluna c = colunaAssentoDao
                .findByIdAndTeatro_Id(idColuna, idTeatro)
                .orElseThrow(() -> new NotFoundException("Coluna inexistente"));
        colunaAssentoDao.delete(c);
    }

    //BUSCAR PELO IDENTIFICADOR (ATUALIZAR)
    public ColunaResponse getColuna(Long idColuna, Long idTeatro) throws NotFoundException {
        return new ColunaResponse(colunaAssentoDao.findByIdAndTeatro_Id(idColuna, idTeatro)
                .orElseThrow(() -> new NotFoundException("Coluna inexistente")));
    }

    public List<ColunaResponse> getColunasResponse(Long idTeatro){
        return colunaAssentoDao
                .findAllByTeatro_Id(idTeatro)
                .stream()
                .map(ColunaResponse::new)
                .toList();
    }

    List<Coluna> getColunas(Long idTeatro){
        return colunaAssentoDao
                .findAllByTeatro_Id(idTeatro);
    }

    public void salvarColunaAssento(Coluna c){
        colunaAssentoDao.save(c);
    }

}
