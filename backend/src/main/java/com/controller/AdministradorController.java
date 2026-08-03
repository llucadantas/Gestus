package com.controller;

import com.database.model.Administrador;
import com.database.repository.projections.AdministradorProjection;
import com.dto.AdministradorDto;
import com.exception.NotFoundException;
import com.services.AdministradorService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/adm")
@RequiredArgsConstructor
public class AdministradorController {
    private final AdministradorService administradorService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void cadastrarAdministrador(@RequestBody AdministradorDto administrador){
        administradorService.CadastrarAdministrador(administrador);
    }

    @GetMapping
    @RequestMapping("./email")
    @ResponseStatus(HttpStatus.OK)
    public AdministradorProjection getAdministrador(@RequestParam("email") String email1) throws NotFoundException {
        return administradorService.getAdministradorByEmail(email1);
    }

    @GetMapping
    @ResponseStatus
    public List<AdministradorProjection> getAllAdministradores(){
        return administradorService.getAllAdministradores();
    }


}
