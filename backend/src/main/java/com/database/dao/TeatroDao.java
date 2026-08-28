package com.database.dao;

import com.database.model.Teatro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TeatroDao extends JpaRepository<Teatro, Long> {

    Optional<Teatro> findByIdAndAdministrador_Id(Long id, Long administradorId);

    Optional<Teatro> findByAdministrador_Id(Long administradorId);
}
