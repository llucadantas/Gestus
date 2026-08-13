package com.database.repository;

import com.database.model.RegraPreco;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RegraPrecoDao extends JpaRepository<RegraPreco,Long> {

    Optional<RegraPreco> findByIdAndTeatro_Id(Long id, Long teatroId);

    List<RegraPreco> findAllByTeatro_Id(Long teatroId);


}
