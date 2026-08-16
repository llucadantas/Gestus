package com.database.repository;

import com.database.model.ColunaAssento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ColunaAssentoDao extends JpaRepository<ColunaAssento, Long> {

    List<ColunaAssento> findAllByTeatro_Id(Long teatroId);

    Optional<ColunaAssento> findByIdAndTeatro_Id(Long id, Long teatroId);
}
