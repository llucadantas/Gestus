package com.services;

import com.events.ContratoCriadoEvent;
import org.springframework.context.ApplicationEventPublisher;
import com.database.model.*;
import com.database.dao.*;
import com.database.model.enums.StatusContrato;
import com.database.model.factory.EstadoContratoFactory;
import com.database.model.state.contrato.EstadoContrato;
import com.dto.requests.ContratoAluguelRequest;
import com.dto.response.ContratoAluguelResponse;
import com.exception.NotFoundException;
import com.exception.ValidacaoException;
import com.services.strategy.sessao.ValidadorContrato;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.yaml.snakeyaml.nodes.Tag.STR;

@Service
@RequiredArgsConstructor
public class ContratoService {

    private final ArtistaService artistaService;
    private final PecaService pecaService;
    private final TeatroService teatroService;
    private final SessaoService sessaoService;
    private final ContratoDao contratoDao;
    private final List<ValidadorContrato> validadoresContrato;
    private final ApplicationEventPublisher eventPublisher;
    private final EstadoContratoFactory estadoContratoFactory;

    @Transactional
    public void cadastrar(ContratoAluguelRequest request, Long idTeatro) {

        Artista artista = artistaService.buscarPorEmail(request.emailArtista());
        Peca peca = pecaService.buscarPeca(request.idPeca());
        Teatro teatro = teatroService.getTeatro(idTeatro);

        for (ValidadorContrato validadorContrato : validadoresContrato) {
            validadorContrato.validar(request);
        }

        Contrato contrato = Contrato.builder()
                .artista(artista)
                .peca(peca)
                .teatro(teatro)
                .status(StatusContrato.EM_ANALISE)
                .build();

        sessaoService.cadastrarSessoes(request, teatro, contrato);
        contrato.calcularValorTotal();
        contrato.gerarTokenAssinatura();
        contratoDao.save(contrato);
        
        eventPublisher.publishEvent(new ContratoCriadoEvent(
                artista.getEmail(), 
                artista.getNome(), 
                peca.getNome(), 
                contrato.getTokenAssinatura()
        ));
    }

    public ContratoAluguelResponse buscarContrato(Long id, Long idTeatro) {
        return contratoDao.findByIdAndTeatro_IdResponse(id, idTeatro)
                .orElseThrow(() -> new NotFoundException("Contrato não existe:"));
    }

    public List<ContratoAluguelResponse> buscarListaContrato(Long idTeatro) {
        return contratoDao.findAllByTeatro_Id(idTeatro);
    }


    @Transactional
    public void assinarContrato(String token) {
        Contrato contrato = contratoDao.findByTokenAssinatura(token)
                .orElseThrow(() -> new RuntimeException("Deu erro na assinatura paeeeeeeee"));
        EstadoContrato estadoAtual = estadoContratoFactory.obterEstado(contrato.getStatus());
        estadoAtual.assinar(contrato);
    }


    @Transactional
    public void cancelarContrato(Long id, Long idTeatro) {
        Contrato contrato = contratoDao.findByIdAndTeatro_Id(id,  idTeatro)
                .orElseThrow(() -> new RuntimeException("Contrato não encontrado"));

        EstadoContrato estadoAtual = estadoContratoFactory.obterEstado(contrato.getStatus());
        estadoAtual.cancelar(contrato);
    }

    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void processarContratosExpirados() {
        List<Contrato> contratosPendentes = contratoDao.findAllStatusAtivoAndStatusEmAnalise();
        for (Contrato contrato : contratosPendentes) {
            EstadoContrato estadoAtual = estadoContratoFactory.obterEstado(contrato.getStatus());
            estadoAtual.verificarExpiracao(contrato);
            contratoDao.save(contrato);
        }
    }
}
