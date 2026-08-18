package com.services;

import com.database.model.Aluguel;
import com.database.model.Artista;
import com.database.model.Peca;
import com.database.model.RegraPreco;
import com.database.repository.AluguelDao;
import com.database.repository.ArtistaDao;
import com.database.repository.PecaDao;
import com.database.repository.RegraPrecoDao;
import com.dto.requests.ContratoAluguelRequest;
import com.dto.response.ContratoAluguelResponse;
import com.exception.NotFoundException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AluguelService {

    private final AluguelDao aluguelDao;
    private final RegraPrecoDao regraPrecoRepository;
    private final PecaDao pecaRepository;
    private final ArtistaDao artistaRepository;

    @Transactional
    public void criar(ContratoAluguelRequest request, Long idTeatro) throws NotFoundException {

        RegraPreco regraPreco = regraPrecoRepository.findByIdAndTeatro_Id(request.idRegraPreco(), idTeatro)
                .orElseThrow(() -> new NotFoundException("Regra de Preço não encontrada para o ID informado."));

        Peca peca = pecaRepository.findByIdAndTeatro_id(request.idPeca(), idTeatro)
                .orElseThrow(() -> new NotFoundException("Peça não encontrada para o ID informado."));

        Artista artista = artistaRepository.findById(request.idArtista())
                .orElseThrow(() -> new NotFoundException("Artista não encontrado para o ID informado."));

        Aluguel contrato = Aluguel.builder()
                .regraPreco(regraPreco)
                .peca(peca)
                .artista(artista)
                .data(request.data())
                .build();

        aluguelDao.save(contrato);

    }

    @Transactional(readOnly = true)
    public ContratoAluguelResponse buscarPorId(Long id, Long idTeatro) throws NotFoundException {
        Aluguel contrato = aluguelDao.findByIdAndPeca_Teatro_Id(id, idTeatro)
                .orElseThrow(() -> new NotFoundException("Contrato de aluguel não encontrado."));
        return new ContratoAluguelResponse(contrato);
    }

    @Transactional(readOnly = true)
    public List<ContratoAluguelResponse> listarTodos(Long idTeatro) {
        return aluguelDao.findAllByPeca_Teatro_Id(idTeatro).stream()
                .map(ContratoAluguelResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deletar(Long id, Long idTeatro) {
        if (!aluguelDao.existsByIdAndPeca_Teatro_Id(id, idTeatro)) {
            throw new EntityNotFoundException("Contrato de aluguel não encontrado para deleção.");
        }
        aluguelDao.deleteById(id);
    }
}