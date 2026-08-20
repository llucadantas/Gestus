package com.controller;

import com.dto.UserDto;
import com.dto.requests.LoginRequest;
import com.dto.requests.RegisterRequest;
import com.dto.response.TokenResponse;
import com.dto.response.UserResponse;
import com.exception.NotFoundException;
import com.exception.TeatroCadastroException;
import com.services.AuthenticationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public void register(@RequestBody @Valid RegisterRequest registerRequest) throws TeatroCadastroException {
        authService.register(registerRequest);
    }

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<UserResponse> login(@RequestBody @Valid LoginRequest loginRequest) {
        return authService.login(loginRequest);}

    @PostMapping("/refresh")
    public ResponseEntity<UserResponse> reemitirToken(@AuthenticationPrincipal UserDto userLogado) throws NotFoundException {
        return authService.refreshToken(userLogado);
    }

}
