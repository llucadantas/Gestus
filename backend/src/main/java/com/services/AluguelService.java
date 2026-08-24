package com.services;

import com.database.model.*;
import com.database.repository.*;
import com.dto.requests.ContratoAluguelRequest;
import com.dto.response.ContratoAluguelResponse;
import com.exception.NotFoundException;
import com.services.strategy.sessao.ValidadorSessao;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AluguelService {

    // Dependências de acesso a dados (Módulos de baixo nível)
    private final ArtistaService artistaService;
    private final PecaService pecaService;
    private final TeatroService teatroService;
    private final SessaoService sessaoService;
    private final AluguelDao aluguelDao;

    private final List<ValidadorSessao> validadores;


    @Transactional // Garante que, se der erro em qualquer dia, nada será salvo
    public void cadastrar(ContratoAluguelRequest request, Long idTeatro) {

        Artista artista = artistaService.buscarPorEmail(request.emailArtista());

        Peca peca = pecaService.buscarPeca(request.idPeca());

        Teatro teatro = teatroService.getTeatro(idTeatro);

        List<Sessao> sessoes = sessaoService.cadastrarSessoes(request, teatro);

        Aluguel aluguel = Aluguel.builder()
                .artista(artista)
                .sessoes(sessoes)
                .peca(peca)
                .teatro(teatro)
                .build();
        aluguelDao.save(aluguel);

    }

    public ContratoAluguelResponse buscarContrato(Long id, Long idTeatro) {
        return new ContratoAluguelResponse(aluguelDao.findByIdAndTeatro_Id(id, idTeatro)
                .orElseThrow(()->new NotFoundException("Contrato não existe:")));
    }

    public List<ContratoAluguelResponse> buscarListaContrato(Long idTeatro) {
        return aluguelDao.findByTeatro_Id(idTeatro)
                .stream()
                .map(ContratoAluguelResponse::new)
                .toList();
    }

}