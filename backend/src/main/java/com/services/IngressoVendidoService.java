package com.services;

import com.database.dao.AssentoSessaoDao;
import com.database.dao.IngressoDao;
import com.database.model.AssentoSessao;
import com.database.model.IngressoVendido;
import com.database.model.Sessao;
import com.database.model.enums.StatusAssento;
import com.dto.requests.IngressoVendidoRequest;
import com.dto.response.AssentoSessaoResponse;
import com.dto.response.IngressoVendidoResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IngressoVendidoService {

    private final IngressoDao ingressoVendidoDao;
    private final AssentoSessaoDao assentoSessaoDao;

    @Transactional
    public void criar(IngressoVendidoRequest request, Long idTeatroContexto) {
        AssentoSessao assento = assentoSessaoDao.findByIdWithLock(request.idAssento(), idTeatroContexto);
        Sessao s = assento.getSessao();

        IngressoVendido ingresso = IngressoVendido.builder()

                .assentoSessao(assento)
                .valor(s.getValorIngresso())
                .email(request.email())
                .build();
        assento.setEstadoAssento(StatusAssento.OCUPADO);
        ingressoVendidoDao.save(ingresso);
    }

    @Transactional(readOnly = true)
    public List<IngressoVendidoResponse> buscarPorEmail(String email) {
        return ingressoVendidoDao.findByEmail(email);
    }

    @Transactional(readOnly = true)
    public List<IngressoVendidoResponse> buscarPorIdTeatro(Long idTeatro) {
        return ingressoVendidoDao.findByTeatroId(idTeatro);
    }
}