package com.controller;

import com.database.model.enums.Turno;
import com.dto.requests.RegraRequest;
import com.dto.response.RegraResponse;
import com.exception.NotFoundException;
import com.services.RegraPrecoService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/v1/regra")
@RequiredArgsConstructor
public class RegraController {
    private final RegraPrecoService regraPrecoService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<RegraResponse> getRegras(@AuthenticationPrincipal(expression = "idTeatro") Long idTeatro) throws NotFoundException {
        return regraPrecoService.getRegrasListResponse(idTeatro);
    }

    @GetMapping
    @RequestMapping("/buscar/{id}")
    @ResponseStatus(HttpStatus.OK)
    public RegraResponse getRegra(@AuthenticationPrincipal(expression = "idTeatro") Long idTeatro,@PathVariable Long id) throws NotFoundException {
        return regraPrecoService.getRegraResponse(idTeatro, id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void cadastrarRegra(@AuthenticationPrincipal(expression = "idTeatro") Long idTeatro, @RequestBody RegraRequest regraPreco) throws NotFoundException {
        regraPrecoService.cadastrarRegraPreco(regraPreco, idTeatro);
    }

    @PutMapping
    @RequestMapping("/atualizar/{id}")
    @ResponseStatus(HttpStatus.CREATED)
    public void atualizarRegra(@AuthenticationPrincipal(expression = "idTeatro") Long idTeatro,
                               @RequestBody RegraRequest regraPreco,
                               @PathVariable Long id) throws NotFoundException {
        regraPrecoService.atualizarRegra(id, idTeatro,regraPreco);
    }

    @DeleteMapping
    @RequestMapping("/{idRegra}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deletarRegra(@AuthenticationPrincipal(expression = "idTeatro") Long idTeatro,
                               @PathVariable Long idRegra) throws NotFoundException {
        regraPrecoService.deletarRegraPreco(idTeatro, idRegra);
    }

    @GetMapping
    @RequestMapping("/preco")
    @ResponseStatus(HttpStatus.OK)
    public List<RegraResponse> buscarPreco(@AuthenticationPrincipal(expression = "idTeatro") Long id,
                                  @RequestParam @DateTimeFormat(pattern = "dd/MM/yyyy") LocalDate data,
                                           @RequestParam Turno turno) {
        return regraPrecoService.obterPrecoAplicavel(data, turno, id);

    }

}
