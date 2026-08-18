package com.database.repository;

import com.database.model.Aluguel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AluguelDao extends JpaRepository<Aluguel, Long> {

    Optional<Aluguel> findByIdAndPeca_Teatro_Id(Long id, Long pecaTeatroId);

    List<Aluguel> findAllByPeca_Teatro_Id(Long id);
    boolean existsByIdAndPeca_Teatro_Id(Long id, Long pecaTeatroId);
}
