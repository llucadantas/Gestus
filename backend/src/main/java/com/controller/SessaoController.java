package com.controller;

import com.database.repository.SessaoDao;
import com.dto.requests.SessaoRequest;
import com.dto.response.SessaoResponse;
import com.exception.NotFoundException;
import com.services.SessaoService;
import lombok.RequiredArgsConstructor;
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

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @RequestMapping("/salvar/{idPeça}")
    public void saveSessao(@RequestBody SessaoRequest sessao,
                           @AuthenticationPrincipal(expression = "idTeatro") Long idTeatro,
                           @PathVariable Long idPeca) throws NotFoundException {
        sessaoService.cadastrarSessao(sessao, idTeatro, idPeca);
    }

    @PutMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @RequestMapping("/atualizar/{idSessao}")
    public void updateSessao(@RequestBody SessaoRequest sessao,
                             @AuthenticationPrincipal(expression = "idTeatro") Long idTeatro,
                             @PathVariable Long idSessao) throws NotFoundException {
        sessaoService.atualizarSessao(sessao, idTeatro, idSessao);
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @RequestMapping("/deletar/{idSessao}")
    public void deleteSessao(@AuthenticationPrincipal(expression = "idTeatro") Long idTeatro,
                             @PathVariable Long idSessao){
        sessaoService.deleteSesao(idTeatro, idSessao);
    }

}
