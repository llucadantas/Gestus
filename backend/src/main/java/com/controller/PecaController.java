package com.controller;

import com.database.model.Peca;
import com.dto.requests.PecaRequest;
import com.dto.response.PecaResponse;
import com.exception.NotFoundException;
import com.services.PecaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/peca")
@RequiredArgsConstructor
public class PecaController {
    private final PecaService pecaService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<PecaResponse> getPecas() {
        return pecaService.listarPecas();
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping("/{id}")
    public Peca getPeca(@PathVariable Long id ) throws NotFoundException {
        return pecaService.buscarPeca(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Peca salvarPeca(@RequestBody PecaRequest pecaRequest) throws NotFoundException {
        return pecaService.cadastrarPeca(pecaRequest);
    }


}
