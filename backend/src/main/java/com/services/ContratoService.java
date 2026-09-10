package com.services;

import com.database.model.*;
import com.database.dao.*;
import com.database.model.enums.StatusContrato;
import com.database.model.factory.EstadoContratoFactory;
import com.database.model.state.contrato.EstadoContrato;
import com.dto.requests.ContratoAluguelRequest;
import com.dto.response.ContratoAluguelResponse;
import com.exception.NotFoundException;
import com.services.strategy.sessao.ValidadorContrato;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ContratoService {

    private final ArtistaService artistaService;
    private final PecaService pecaService;
    private final TeatroService teatroService;
    private final SessaoService sessaoService;
    private final ContratoDao contratoDao;
    private final List<ValidadorContrato> validadoresContrato;
    private final EmailService emailService;
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

        List<Sessao> sessoes = sessaoService.cadastrarSessoes(request, teatro, contrato);
        contrato.setSessoes(sessoes);
        contrato.calcularValorTotal();
        contratoDao.save(contrato);
        enviarParaArtista(artista, contrato);
    }

    private void enviarParaArtista(Artista artista,Contrato contrato){
        contrato.gerarTokenAssinatura();
        String linkAssinatura = STR."http://localhost:8080/v1/aluguel/assinar?token=\{contrato.getTokenAssinatura()}";
        emailService.enviarEmailAssinaturaHTML(artista.getEmail(), artista.getNome(), contrato.getPeca().getNome(),  linkAssinatura);
    }

    public ContratoAluguelResponse buscarContrato(Long id, Long idTeatro) {
        return new ContratoAluguelResponse(contratoDao.findByIdAndTeatro_Id(id, idTeatro)
                .orElseThrow(() -> new NotFoundException("Contrato não existe:")));
    }

    public List<ContratoAluguelResponse> buscarListaContrato(Long idTeatro) {
        return contratoDao.findAllByTeatro_Id(idTeatro)
                .stream()
                .map(ContratoAluguelResponse::new)
                .toList();
    }


    @Transactional
    public void delete(Long idTeatro, Long idAluguel) {
        teatroService.getTeatro(idTeatro);
        contratoDao.delete(idAluguel);
    }

    @Transactional
    public void assinarContrato(String token) {
        Contrato contrato = contratoDao.findByTokenAssinatura(token)
                .orElseThrow(() -> new RuntimeException("Deu erro na assinatura paeeeeeeee"));

        EstadoContrato estadoAtual = estadoContratoFactory.obterEstado(contrato.getStatus());

        estadoAtual.assinar(contrato);

        contratoDao.save(contrato);
    }


    @Transactional
    public void cancelarContrato(Long id, Long idTeatro) {
        Contrato contrato = contratoDao.findByIdAndTeatro_Id(id,  idTeatro)
                .orElseThrow(() -> new RuntimeException("Contrato não encontrado"));

        EstadoContrato estadoAtual = estadoContratoFactory.obterEstado(contrato.getStatus());
        estadoAtual.cancelar(contrato);

        contratoDao.save(contrato);
    }

    @Scheduled(cron = "0 0 0 * * *")
    @Transactional
    public void processarContratosExpirados() {
        // 1. Busca no banco apenas contratos que ainda estão "vivos" (Em análise ou Ativos)
        List<Contrato> contratosPendentes = contratoDao.findAllStatusAtivoAndStatusEmAnalise();

        // 2. Passa por cada contrato delegando a verificação de data para o Estado
        for (Contrato contrato : contratosPendentes) {
            EstadoContrato estadoAtual = estadoContratoFactory.obterEstado(contrato.getStatus());

            // O polimorfismo acontece aqui!
            // Se estiver em análise, checa a data limite de assinatura.
            // Se estiver ativo, checa a data de fim do aluguel.
            estadoAtual.verificarExpiracao(contrato);
            contratoDao.save(contrato);
        }
    }
}
