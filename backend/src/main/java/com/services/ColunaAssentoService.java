package com.services;

import com.database.model.Assento;
import com.database.model.ColunaAssento;
import com.database.repository.ColunaAssentoDao;
import com.dto.requests.ColunaAssentoRequest;
import com.dto.response.ColunaResponse;
import com.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ColunaAssentoService {
    private final ColunaAssentoDao colunaAssentoDao;
    private final TeatroService teatroService;


    public void criarColuna(ColunaAssentoRequest colunaAssentoRequest, Long idTeatro) throws NotFoundException {
        ColunaAssento colunaAssento = ColunaAssento.builder()
                .qntdAssentos(colunaAssentoRequest.qntdAssentos())
                .identificadorColuna(colunaAssentoRequest.identificadorColuna())
                .teatro(teatroService.getTeatro(idTeatro))
                .build();
        colunaAssentoDao.save(colunaAssento);
    }

    public void apagarColuna(Long idTeatro, Long idColuna) throws NotFoundException {
        ColunaAssento c = colunaAssentoDao
                .findByIdAndTeatro_Id(idColuna, idTeatro)
                .orElseThrow(() -> new NotFoundException("Coluna inexistente"));
        colunaAssentoDao.delete(c);
    }

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

    List<ColunaAssento> getColunas(Long idTeatro){
        return colunaAssentoDao
                .findAllByTeatro_Id(idTeatro);
    }

    public void salvarColunaAssento(ColunaAssento c){
        colunaAssentoDao.save(c);
    }



}
