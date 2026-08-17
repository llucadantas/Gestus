package com.database.repository;

import com.database.model.Coluna;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ColunaAssentoDao extends JpaRepository<Coluna, Long> {

    List<Coluna> findAllByTeatro_Id(Long teatroId);

    Optional<Coluna> findByIdAndTeatro_Id(Long id, Long teatroId);
}
