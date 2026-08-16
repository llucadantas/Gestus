package com.controller;

import com.dto.requests.ColunaAssentoRequest;
import com.dto.response.ColunaResponse;
import com.exception.NotFoundException;
import com.services.AssentoService;
import com.services.ColunaAssentoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/colunas")
@RequiredArgsConstructor
public class ConfigAssentosController {
    private final ColunaAssentoService colunaAssentoService;
    private final AssentoService assentoService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void criarColuna(@RequestBody ColunaAssentoRequest colunaAssentoRequest, @AuthenticationPrincipal(expression = "idTeatro") Long idTeatro) throws NotFoundException {
        colunaAssentoService.criarColuna(colunaAssentoRequest, idTeatro);
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @RequestMapping("/excluir/{idColuna}")
    public void excluirColuna(@AuthenticationPrincipal(expression = "idTeatro") Long idTeatro,
                              @PathVariable Long idColuna) throws NotFoundException {
        colunaAssentoService.apagarColuna(idTeatro, idColuna);
    }

    @PutMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @RequestMapping("/criar_assento")
    public void criarAssentos(@AuthenticationPrincipal(expression = "idTeatro") Long idTeatro) throws NotFoundException {
        assentoService.criarAssentos(idTeatro);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<ColunaResponse> getColunas(@AuthenticationPrincipal(expression = "idTeatro") Long idTeatro) {
        return colunaAssentoService.getColunasResponse(idTeatro);
    }

}
