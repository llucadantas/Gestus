package com.database.repository;

import com.database.model.Administrador;
import com.database.repository.projections.AdministradorProjection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdministradorDao extends JpaRepository<Administrador, Long> {
    Optional<AdministradorProjection> getAdministradorByEmail(String email);
    Administrador getAdministradorById(Long id);
    List<AdministradorProjection> findAllProjecao();


}
