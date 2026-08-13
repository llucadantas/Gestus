package com.database.repository;

import com.database.model.Teatro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TeatroDao extends JpaRepository<Teatro, Long> {

    Optional<Teatro> findByIdAndAdministrador_Id(Long id, Long administradorId);

    Optional<Teatro> findByAdministrador_Id(Long administradorId);
}
