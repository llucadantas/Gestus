package com.services;

import com.database.model.Administrador;
import com.database.repository.AdministradorDao;
import com.dto.UserDto;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {
    private final AdministradorDao administradorDao;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Administrador a = administradorDao.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario não encontrado"));
        Long idTeatro = (a.getTeatro() != null) ? a.getTeatro().getId() : null;
        return new UserDto(a.getId(), a.getNome(), a.getEmail(), idTeatro, a.getSenha());
    }
}
