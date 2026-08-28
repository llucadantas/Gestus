package com.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class IngressoVendidoService {

//    private final IngressoDao ingressoVendidoDao;
//    private final SessaoDao sessaoDao;
//    private final AssentoDao assentoDao;
//
//    @Transactional
//    public void criar(IngressoVendidoRequest request, Long idTeatroContexto) {
//        Sessao sessao = sessaoDao.findById(request.idSessao())
//                .orElseThrow(() -> new EntityNotFoundException("Sessão não encontrada."));
//        if (!sessao.getPeca().getTeatro().getId().equals(idTeatroContexto)) {
//            throw new IllegalArgumentException("Acesso negado: Esta sessão não pertence ao seu teatro.");
//        }
//        Assento assento = assentoDao.findById(request.idAssento())
//                .orElseThrow(() -> new EntityNotFoundException("Assento não encontrado."));
//        if (!assento.getColuna().getTeatro().getId().equals(idTeatroContexto)) {
//            throw new IllegalArgumentException("Acesso negado: Este assento não pertence ao seu teatro.");
//        }
//        assento.ocupar();
//        assentoDao.save(assento);
//        IngressoVendido ingresso = IngressoVendido.builder()
//                .sessao(sessao)
//                .assento(assento)
//                .email(request.email())
//                .build();
//        ingressoVendidoDao.save(ingresso);
//    }
//
//    @Transactional(readOnly = true)
//    public IngressoVendidoResponse buscarPorId(Long id, Long idTeatroContexto) {
//        IngressoVendido ingresso = ingressoVendidoDao.findById(id)
//                .orElseThrow(() -> new EntityNotFoundException("Ingresso não encontrado."));
//
//        if (!ingresso.getSessao().getPeca().getTeatro().getId().equals(idTeatroContexto)) {
//            throw new IllegalArgumentException("Acesso negado: Este ingresso não pertence ao seu teatro.");
//        }
//
//        return new IngressoVendidoResponse(ingresso);
//    }
//
//    @Transactional(readOnly = true)
//    public List<IngressoVendidoResponse> listarPorSessao(Long idSessao, Long idTeatroContexto) {
//        Sessao sessao = sessaoDao.findById(idSessao)
//                .orElseThrow(() -> new EntityNotFoundException("Sessão não encontrada."));
//
//        if (!sessao.getPeca().getTeatro().getId().equals(idTeatroContexto)) {
//            throw new IllegalArgumentException("Acesso negado: A sessão informada não pertence ao seu teatro.");
//        }
//
//        return ingressoVendidoDao.findBySessao_Id(idSessao).stream()
//                .map(IngressoVendidoResponse::new)
//                .collect(Collectors.toList());
//    }
//
//    @Transactional
//    public void deletar(Long id, Long idTeatroContexto) {
//        IngressoVendido ingresso = ingressoVendidoDao.findById(id)
//                .orElseThrow(() -> new EntityNotFoundException("Ingresso não encontrado para cancelamento."));
//        if (!ingresso.getSessao().getPeca().getTeatro().getId().equals(idTeatroContexto)) {
//            throw new IllegalArgumentException("Acesso negado: Você não tem permissão para cancelar este ingresso.");
//        }
//        Assento assento = ingresso.getAssento();
//        assento.liberar();
//        assentoDao.save(assento);
//        ingressoVendidoDao.delete(ingresso);
//    }
}