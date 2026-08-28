package com.controller;

import com.dto.response.SessaoProjection;
import com.dto.response.SessaoResponse;
import com.exception.NotFoundException;
import com.services.SessaoService;
import lombok.RequiredArgsConstructor;


import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/sessao")
@RequiredArgsConstructor
public class SessaoController {
    private final SessaoService sessaoService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping("/{idSessao}")
    public SessaoResponse getSessao(@PathVariable Long idSessao, @AuthenticationPrincipal(expression = "idTeatro") Long idTeatro) throws NotFoundException {
        return sessaoService.getSessaoResponse(idSessao, idTeatro);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<SessaoResponse> getSessoes(@AuthenticationPrincipal(expression = "idTeatro") Long idTeatro) {
        return sessaoService.getSessoes(idTeatro);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping("/resumo")
    public Page<SessaoProjection> getSessoesResumo(@AuthenticationPrincipal(expression = "idTeatro") Long idTeatro,
                                                   @RequestParam(defaultValue = "0") int pagina,
                                                   @RequestParam(defaultValue = "10") int tamanho){
        return sessaoService.sessoesRecentes(idTeatro, pagina, tamanho);
    }




}
