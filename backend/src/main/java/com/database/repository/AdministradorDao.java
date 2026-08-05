package com.database.repository;

import com.database.model.Administrador;
import com.dto.response.AdministradorResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdministradorDao extends JpaRepository<Administrador, Long> {
    @Query("""
        SELECT new com.dto.response.AdministradorResponse(a.id, a.nome, a.email)
        FROM Administrador a WHERE a.email = :email
""")
    Optional<AdministradorResponse> getAdministradorByEmail(@Param("email") String email);
    @Query("""
        SELECT new com.dto.response.AdministradorResponse(a.id, a.nome, a.email)
        FROM Administrador a WHERE a.id = :id
""")
    Optional<AdministradorResponse> getAdministradorById(@Param("id")Long id);
    @Query("""
    SELECT new com.dto.response.AdministradorResponse(a.id, a.nome, a.email)
    FROM Administrador a
""")
    List<AdministradorResponse> findAllAdministradores();

    Optional<Administrador> findByEmail(String email);
}
