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
    public List<PecaResponse> getPecas(@AuthenticationPrincipal(expression = "idTeatro") Long idTeatro) {
        return pecaService.listarPecas(idTeatro);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    @RequestMapping("/{id}")
    public PecaResponse getPeca(@AuthenticationPrincipal(expression = "idTeatro") Long idTeatro, @PathVariable Long id ) throws NotFoundException {
        return pecaService.bucarPeca(id, idTeatro);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void salvarPeca(@AuthenticationPrincipal(expression = "idTeatro") Long idTeatro, @RequestBody PecaRequest pecaRequest) throws NotFoundException {
        pecaService.cadastrarPeca(pecaRequest, idTeatro);
    }

    @PutMapping
    @ResponseStatus(HttpStatus.CREATED)
    @RequestMapping("/atualizar/{id}")
    public void atualizarPeca(@AuthenticationPrincipal(expression = "idTeatro") Long idTeatro,
                              @RequestBody PecaRequest pecaRequest,
                              @PathVariable Long id) throws NotFoundException {
        pecaService.atualizarPeca(id, pecaRequest, idTeatro);
    }

    @DeleteMapping
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @RequestMapping("/delete/{id}")
    public void deletarPeca(@AuthenticationPrincipal(expression = "idTeatro") Long idTeatro,
                            @PathVariable Long id) throws NotFoundException {
        pecaService.deletarPeca(id, idTeatro);
    }

}
