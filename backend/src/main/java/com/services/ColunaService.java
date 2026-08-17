package com.services;

import com.database.model.Coluna;
import com.database.repository.ColunaAssentoDao;
import com.dto.requests.ColunaRequest;
import com.dto.response.ColunaResponse;
import com.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ColunaService {
    private final ColunaAssentoDao colunaAssentoDao;
    private final TeatroService teatroService;


    public void criarColuna(ColunaRequest colunaRequest, Long idTeatro) throws NotFoundException {
        Coluna coluna = Coluna.builder()
                .qntdAssento(colunaRequest.qntd())
                .identificadorColuna(colunaRequest.identificador())
                .teatro(teatroService.getTeatro(idTeatro))
                .build();
        colunaAssentoDao.save(coluna);
    }

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
