package com.config;

import com.dto.UserDto;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class TokenProvider {
    @Value("${spring.jwt.expiration}")
    private long expirationTime;

    @Value("${spring.jwt.key}")
    private String key;

    //gerar um token
    public String gerarToken(Authentication authentication) {
        Object principal = authentication.getPrincipal();

        if (principal instanceof UserDto user) {
            return buildToken(user.id(), user.nome(), user.getUsername(), user.idTeatro());
        }

        // Fallback caso seja apenas UserDetails genérico
        return buildToken(null, null, authentication.getName(), null);
    }

    public String buildToken(Long id, String nome, String username, Long idTeatro) {
        Date now = new Date();
        Date expiration = new Date(now.getTime() + expirationTime);

        var builder = Jwts.builder()
                .subject(username)
                .issuedAt(now)
                .expiration(expiration)
                .signWith(getSigninKey());

        // Escreve os dados dentro do Payload do JWT (Claims)
        if (id != null) builder.claim("id", id);
        if (nome != null) builder.claim("nome", nome);
        if (idTeatro != null) builder.claim("idTeatro", idTeatro);

        return builder.compact();
    }

    private SecretKey getSigninKey() {
        return Keys.hmacShaKeyFor(key.getBytes(java.nio.charset.StandardCharsets.UTF_8));
    }


    //validar um token
    public boolean isTokenValid(String token) {
        try {
            getClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigninKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
    //extrair info do token

    public String getUsername(String token) {
        return getClaims(token).getSubject();
    }

    public UserDto getUserDetails(String token) {
        Claims claims = getClaims(token);

        Long id = claims.get("id", Long.class);
        String nome = claims.get("nome", String.class);
        String username = claims.getSubject();
        Long idTeatro = claims.get("idTeatro", Long.class);

        return new UserDto(id, nome, username, idTeatro, null);
    }

}
