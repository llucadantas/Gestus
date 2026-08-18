package com.controller;

import com.dto.requests.ContratoAluguelRequest;
import com.dto.response.ContratoAluguelResponse;
import com.exception.NotFoundException;
import com.services.AluguelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/aluguel")
@RequiredArgsConstructor
public class AluguelController {
    private final AluguelService aluguelService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void criar(
            @RequestBody @Valid ContratoAluguelRequest request,
            @AuthenticationPrincipal(expression = "idTeatro") Long idTeatro) throws NotFoundException {

        aluguelService.criar(request, idTeatro);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ContratoAluguelResponse buscarPorId(
            @PathVariable Long id,
            @AuthenticationPrincipal(expression = "idTeatro") Long idTeatro) throws NotFoundException {

        return aluguelService.buscarPorId(id, idTeatro);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<ContratoAluguelResponse> listarTodos(
            @AuthenticationPrincipal(expression = "idTeatro") Long idTeatrp) {

        return aluguelService.listarTodos(idTeatrp);
    }


    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletar(
            @PathVariable Long id,
            @AuthenticationPrincipal(expression = "idTeatro")Long idTeatro) {

        aluguelService.deletar(id,idTeatro);
    }
}

