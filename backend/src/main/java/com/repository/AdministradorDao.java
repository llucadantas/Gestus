package com.repository;

import com.model.Administrador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdministradorDao extends JpaRepository<Administrador, Long> {
}
