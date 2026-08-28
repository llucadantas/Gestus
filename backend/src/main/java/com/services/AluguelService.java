package com.services;

import com.database.model.*;
import com.database.dao.*;
import com.dto.requests.ContratoAluguelRequest;
import com.dto.response.ContratoAluguelResponse;
import com.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AluguelService {

    private final ArtistaService artistaService;
    private final PecaService pecaService;
    private final TeatroService teatroService;
    private final SessaoService sessaoService;
    private final AluguelDao aluguelDao;



    @Transactional
    public void cadastrar(ContratoAluguelRequest request, Long idTeatro) {

        Artista artista = artistaService.buscarPorEmail(request.emailArtista());

        Peca peca = pecaService.buscarPeca(request.idPeca());

        Teatro teatro = teatroService.getTeatro(idTeatro);


        Aluguel aluguel = Aluguel.builder()
                .artista(artista)
                .peca(peca)
                .teatro(teatro)
                .build();

        List<Sessao> sessoes = sessaoService.cadastrarSessoes(request, teatro, aluguel);
        aluguel.setSessoes(sessoes);
        aluguel.calcularValorTotal();
        aluguelDao.save(aluguel);

    }

    public ContratoAluguelResponse buscarContrato(Long id, Long idTeatro) {
        return new ContratoAluguelResponse(aluguelDao.findByIdAndTeatro_Id(id, idTeatro)
                .orElseThrow(()->new NotFoundException("Contrato não existe:")));
    }

    public List<ContratoAluguelResponse> buscarListaContrato(Long idTeatro) {
        return aluguelDao.findAllByTeatro_Id(idTeatro)
                .stream()
                .map(ContratoAluguelResponse::new)
                .toList();
    }

}