package com.controller;

import com.database.model.Administrador;
import com.database.model.Teatro;
import com.dto.requests.TeatroRequest;
import com.dto.response.TeatroResponse;
import com.exception.NotFoundException;
import com.exception.TeatroCadastroException;
import com.services.AdministradorService;
import com.services.TeatroService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.hibernate.annotations.NotFound;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/teatro")
@RequiredArgsConstructor
public class TeatroController {
    private final TeatroService teatroService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void cadastrarTeatro(@RequestBody @Valid TeatroRequest teatroRequest, @AuthenticationPrincipal Administrador administrador) throws NotFoundException, TeatroCadastroException {
        teatroService.cadastrarTeatro(teatroRequest, administrador.getId());
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public TeatroResponse getTeatro(@AuthenticationPrincipal(expression = "id") Long id) throws NotFoundException {
        Teatro t = teatroService.getTeatro(id);
        return new TeatroResponse(t.getId(), t.getNome(), t.getAdministrador().getId());
    }





}
