package com.services;

import com.database.model.Artista;
import com.database.repository.ArtistaDao;
import com.dto.requests.ArtistaRequest;
import com.dto.response.ArtistaResponse;
import com.exception.NotFoundException;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ArtistaService {

    private final ArtistaDao artistaDao;

    @Transactional
    public void criar(ArtistaRequest request) {

        Artista artista = Artista.builder()
                .nome(request.nome())
                .email(request.email())
                .build();

        artistaDao.save(artista);
    }

    @Transactional(readOnly = true)
    public ArtistaResponse buscarPorId(Long id, Long idTeatroContexto) throws NotFoundException {
        Artista artista = artistaDao.findById(id)
                .orElseThrow(() -> new NotFoundException("Artista não encontrado."));

        return new ArtistaResponse(artista);
    }

    @Transactional(readOnly = true)
    public List<ArtistaResponse> listarTodos() {
        return artistaDao.findAll().stream()
                .map(ArtistaResponse::new)
                .collect(Collectors.toList());
    }

    @Transactional
    public void atualizar(Long id, ArtistaRequest request) {
        Artista artista = artistaDao.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Artista não encontrado para atualização."));

        artista.setNome(request.nome());
        artista.setEmail(request.email());

       artistaDao.save(artista);

    }

    @Transactional
    public void deletar(Long id) {
        if (!artistaDao.existsById(id)) {
            throw new EntityNotFoundException("Artista não encontrado para deleção.");
        }
        artistaDao.deleteById(id);
    }
}