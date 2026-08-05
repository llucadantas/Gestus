package com.controller;

import com.dto.requests.RegisterRequest;
import com.dto.response.AdministradorResponse;
import com.exception.NotFoundException;
import com.services.AdministradorService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/adm")
@RequiredArgsConstructor
public class AdministradorController {
    private final AdministradorService administradorService;

    @GetMapping
    @RequestMapping("/email")
    @ResponseStatus(HttpStatus.OK)
    public AdministradorResponse getAdministrador(@RequestParam("email") String email1) throws NotFoundException {
        return administradorService.getAdministradorByEmail(email1);
    }

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<AdministradorResponse> getAllAdministradores(){
        return administradorService.getAllAdministradores();
    }


    @GetMapping
    @RequestMapping("/id/{id}")
    @ResponseStatus(HttpStatus.OK)
    public AdministradorResponse getAdministradorById(@PathVariable("id") Long id) throws NotFoundException {
        return administradorService.getAdministradorById(id);
    }



}
