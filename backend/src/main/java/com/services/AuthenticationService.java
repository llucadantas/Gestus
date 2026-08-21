package com.services;

import com.config.TokenProvider;
import com.database.model.Administrador;
import com.database.repository.AdministradorDao;
import com.dto.UserDto;
import com.dto.requests.LoginRequest;
import com.dto.requests.RegisterRequest;
import com.dto.response.TokenResponse;
import com.dto.response.UserResponse;
import com.exception.NotFoundException;
import com.exception.TeatroCadastroException;
import jakarta.servlet.http.Cookie;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
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
    private final TeatroService teatroService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final TokenProvider tokenProvider;

    public void register(RegisterRequest registerRequest) throws TeatroCadastroException {
        if(administradorDao.findByEmail(registerRequest.email()).isPresent()){
            throw new DataIntegrityViolationException("B.O NOS DADOS");
        }
        Administrador a = administradorDao.save(Administrador.builder()
                .nome(registerRequest.nome())
                .email(registerRequest.email())
                .senha(passwordEncoder.encode(registerRequest.senha()))
                .build());
        teatroService.cadastrarTeatro(registerRequest.nomeTeatro(), a);
    }

    public ResponseEntity<UserResponse> login(LoginRequest loginRequest) {
        try {
            Authentication a =  authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.email(), loginRequest.senha()));
            String token = tokenProvider.gerarToken(a);

            Administrador adm = administradorDao.
                    findByEmail(loginRequest.email())
                    .orElseThrow(()-> new NotFoundException("Usuario não existe"));
            return criarCookie(adm, adm.getTeatro().getId(), token);
        } catch (BadCredentialsException bad){
            throw new BadCredentialsException("Senha invalida");
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public ResponseEntity<Void> logout() {
        ResponseCookie cookieLimpo = ResponseCookie.from("jwt_gestus", "")
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(0) // 0 segundos: destrói o cookie no navegador
                .sameSite("Lax")
                .build();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookieLimpo.toString())
                .build();
    }

    public ResponseEntity<UserResponse> refreshToken(UserDto userLogado) throws NotFoundException {
        Administrador adm = administradorDao.findById(userLogado.id())
                .orElseThrow(() -> new NotFoundException("Usuário não encontrado"));

        Long idTeatro = (adm.getTeatro() != null) ? adm.getTeatro().getId() : null;

        String novoToken = tokenProvider.buildToken(
                adm.getId(),
                adm.getNome(),
                adm.getEmail(),
                idTeatro
        );

        return criarCookie(adm,idTeatro, novoToken);
    }

    private ResponseEntity<UserResponse> criarCookie(Administrador adm, Long idTeatro, String token) {

        ResponseCookie cookie = ResponseCookie.from("jwt_gestus", token)
                .httpOnly(true)
                .secure(false) // Defina como true quando for para produção com HTTPS
                .path("/")
                .build();

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, cookie.toString())
                .body(new UserResponse(adm));
    }

}
