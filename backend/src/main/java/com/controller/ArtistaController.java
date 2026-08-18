package com.controllers; // Ajuste para o seu pacote de controllers

import com.dto.requests.ArtistaRequest;
import com.dto.response.ArtistaResponse;
import com.exception.NotFoundException;
import com.services.ArtistaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/artistas")
@RequiredArgsConstructor
public class ArtistaController {

    private final ArtistaService artistaService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void criar(@RequestBody @Valid ArtistaRequest request) {
        artistaService.criar(request);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ArtistaResponse buscarPorId(
            @PathVariable Long id,
            @AuthenticationPrincipal(expression = "idTeatro") Long idTeatro) throws NotFoundException {

        return artistaService.buscarPorId(id, idTeatro);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<ArtistaResponse> listarTodos() {
        return artistaService.listarTodos();
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void atualizar(@PathVariable Long id, @RequestBody @Valid ArtistaRequest request) {

        artistaService.atualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(@PathVariable Long id) {
        artistaService.deletar(id);
    }
}