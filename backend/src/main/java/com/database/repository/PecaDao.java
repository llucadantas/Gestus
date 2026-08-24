package com.database.repository;

import com.database.model.Peca;
import com.dto.response.PecaResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PecaDao extends JpaRepository<Peca, Long> {
    List<Peca> findAllByTeatro_Id(Long idTeatro);

    Optional<Peca> findByIdAndTeatro_Id(Long id,Long idTeatro);
}