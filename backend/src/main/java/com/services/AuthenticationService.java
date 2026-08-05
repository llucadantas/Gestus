package com.services;

import com.config.TokenProvider;
import com.database.model.Administrador;
import com.database.repository.AdministradorDao;
import com.dto.requests.LoginRequest;
import com.dto.requests.RegisterRequest;
import com.dto.response.TokenResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.token.TokenService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final AdministradorDao administradorDao;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final TokenProvider tokenProvider;
    @Value("${spring.jwt.expiration}")
    private long expirationTime;


    public void register(RegisterRequest registerRequest) {
        administradorDao.save(Administrador.builder()
                .nome(registerRequest.nome())
                .email(registerRequest.email())
                .senha(passwordEncoder.encode(registerRequest.senha()))
                .build());
    }

    public TokenResponse login(LoginRequest loginRequest) {
        try {
            Authentication a =  authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.email(), loginRequest.senha()));
            String token = tokenProvider.gerarToken(a);

            return new TokenResponse(token, expirationTime);
        } catch (BadCredentialsException bad){
            throw new BadCredentialsException("Invalid username and password");
        } catch (Exception e) {

            throw new RuntimeException(e);

        }

    }

}
