package com.database.repository;

import com.database.model.Peca;
import com.dto.response.PecaResponse;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PecaDao extends CrudRepository<Peca, Long> {

    List<Peca> findAllByTeatro_id(Long teatroId);

    Optional<Peca> findByIdAndTeatro_id(Long id, Long teatro_id);
}