package com.controller;


import com.dto.response.AdministradorResponse;
import com.dto.response.TeatroResponse;
import com.exception.NotFoundException;
import com.services.AdministradorService;
import com.services.TeatroService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/v1/admin")
@RequiredArgsConstructor
public class AdministradorController {
    private final AdministradorService admService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public AdministradorResponse getTeatro(@AuthenticationPrincipal(expression = "id") Long id) throws NotFoundException {
        return admService.getAdministradorById(id);
    }

}
