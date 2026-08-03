package com.services;


import com.database.repository.projections.AdministradorProjection;
import com.dto.AdministradorDto;
import com.exception.NotFoundException;
import com.database.model.Administrador;
import com.database.repository.AdministradorDao;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdministradorService {
    private final AdministradorDao administradorDao;

    public void CadastrarAdministrador(AdministradorDto administradorDto) {
        Administrador administrador = Administrador.builder()
                .nome(administradorDto.nome())
                .email(administradorDto.email())
                .senha(administradorDto.senha())
                .build();
        administradorDao.save(administrador);
    }

    public AdministradorProjection getAdministradorByEmail(String email) throws NotFoundException {
        return administradorDao.getAdministradorByEmail(email).
            orElseThrow(()-> new NotFoundException("Administrador não encontrado."));
    }

    public List<AdministradorProjection> getAllAdministradores() {
        return administradorDao.findAllProjecao();
    }


    public void deletarAdm(Long id){
        administradorDao.deleteById(id);
    }
}
