package com.controller;

import com.dto.requests.ContratoAluguelRequest;
import com.dto.response.ContratoAluguelResponse;
import com.exception.NotFoundException;
import com.services.ContratoService;
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
    private final ContratoService contratoService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void criar(
            @RequestBody @Valid ContratoAluguelRequest request,
            @AuthenticationPrincipal(expression = "idTeatro") Long idTeatro) throws NotFoundException {

        contratoService.cadastrar(request, idTeatro);
    }

    @GetMapping("/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ContratoAluguelResponse buscarPorId(
            @PathVariable Long id,
            @AuthenticationPrincipal(expression = "idTeatro") Long idTeatro) throws NotFoundException {

        return contratoService.buscarContrato(id, idTeatro);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<ContratoAluguelResponse> listarTodos(
            @AuthenticationPrincipal(expression = "idTeatro") Long idTeatro) {

        return contratoService.buscarListaContrato(idTeatro);
    }

    @PostMapping("/renovar")
    @ResponseStatus(HttpStatus.CREATED)
    public void renovarContrato(){

    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cancelar(
            @PathVariable Long id,
            @AuthenticationPrincipal(expression = "idTeatro")Long idTeatro) {

        contratoService.cancelarContrato(id, idTeatro);
    }

    @GetMapping("/assinar")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void assinar(@RequestParam("token") String token){
        contratoService.assinarContrato(token);
    }
}

