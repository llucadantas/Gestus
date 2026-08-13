package com.services;


import com.database.model.Teatro;
import com.dto.response.AdministradorResponse;
import com.exception.NotFoundException;
import com.database.model.Administrador;
import com.database.repository.AdministradorDao;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdministradorService {
    private final AdministradorDao administradorDao;

    public AdministradorResponse getAdministradorByEmail(String email) throws NotFoundException {
        return administradorDao.getAdministradorByEmail(email).
            orElseThrow(()-> new NotFoundException("Administrador não encontrado."));
    }

    public List<AdministradorResponse> getAllAdministradores() {
        return administradorDao.findAllAdministradores();
    }


    public AdministradorResponse getAdministradorById(Long id) throws NotFoundException {
        return administradorDao.getAdministradorById(id)
                .orElseThrow(()-> new NotFoundException("Administrador não encontrado."));
    }

   public void deletarAdm(Long id){
        administradorDao.deleteById(id);
    }
}
