package com.controller;

import com.database.model.Assento;
import com.dto.requests.ColunaRequest;
import com.dto.response.AssentoResponse;
import com.dto.response.ColunaResponse;
import com.exception.NotFoundException;
import com.services.AssentoService;
import com.services.ColunaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/v1/colunas")
@RequiredArgsConstructor
public class MapAssentoController {
    private final ColunaService colunaService;
    private final AssentoService assentoService;


//    PADRAO STATE, ORGANIZAR CHAMADAS POR ID, EXCESSOES


//    @PostMapping
//    @ResponseStatus(HttpStatus.CREATED)
//    public void criarColunas(@RequestBody Set<ColunaRequest> colunaRequest, @AuthenticationPrincipal(expression = "idTeatro") Long idTeatro) throws NotFoundException {
//        colunaService.salvarColunas(colunaRequest, idTeatro);
//    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ColunaResponse criarColuna(@RequestBody ColunaRequest colunaRequest, @AuthenticationPrincipal(expression = "idTeatro") Long idTeatro) throws NotFoundException {
        return colunaService.criarColuna(colunaRequest, idTeatro);
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @RequestMapping("/excluir/{idColuna}")
    public void excluirColuna(@AuthenticationPrincipal(expression = "idTeatro") Long idTeatro,
                              @PathVariable Long idColuna) throws NotFoundException {
        colunaService.apagarColuna(idTeatro, idColuna);
    }


    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<ColunaResponse> getColunas(@AuthenticationPrincipal(expression = "idTeatro") Long idTeatro) {
        return colunaService.getColunasResponse(idTeatro);
    }

    @GetMapping
    @RequestMapping("/assentos")
    @ResponseStatus(HttpStatus.OK)
    public List<AssentoResponse> getAssentos(@AuthenticationPrincipal(expression = "idTeatro") Long idTeatro) {
        return assentoService.getAssentos(idTeatro);
    }

}
