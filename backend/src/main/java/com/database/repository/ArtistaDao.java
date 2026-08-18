package com.database.repository;

import com.database.model.Artista;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ArtistaDao extends JpaRepository<Artista, Long> {
}
