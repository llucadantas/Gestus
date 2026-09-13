package com.controller;

import com.dto.requests.IngressoVendidoRequest;
import com.dto.response.IngressoVendidoResponse;
import com.services.IngressoVendidoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ingressos")
@RequiredArgsConstructor
public class IngressoController {

    private final IngressoVendidoService ingressoVendidoService;

    @PostMapping("/teatro/{idTeatroContexto}")
    @ResponseStatus(HttpStatus.CREATED)
    public void criar(
            @AuthenticationPrincipal(expression = "idTeatro") Long idTeatroContexto,
            @RequestBody IngressoVendidoRequest request) {
        ingressoVendidoService.criar(request, idTeatroContexto);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<IngressoVendidoResponse> buscarPorEmail(
            @RequestParam String email) {

        List<IngressoVendidoResponse> ingressos = ingressoVendidoService.buscarPorEmail(email);
        return ingressos;
    }

    @GetMapping("/teatro/{idTeatro}")
    @ResponseStatus(HttpStatus.OK)
    public List<IngressoVendidoResponse> buscarPorIdTeatro(
            @AuthenticationPrincipal(expression = "idTeatro") Long idTeatroContexto) {

        List<IngressoVendidoResponse> ingressos = ingressoVendidoService.buscarPorIdTeatro(idTeatroContexto);
        return ingressos;
}}