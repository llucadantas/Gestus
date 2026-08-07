package com.controller;

import com.database.model.Administrador;
import com.dto.requests.RegisterRequest;
import com.dto.response.AdministradorResponse;
import com.exception.NotFoundException;
import com.services.AdministradorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/adm")
@RequiredArgsConstructor
public class AdministradorController {
    private final AdministradorService administradorService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public AdministradorResponse getAdministrador(@AuthenticationPrincipal(expression = "id") Long id) throws NotFoundException {
        return administradorService.getAdministradorById(id);
    }

}
