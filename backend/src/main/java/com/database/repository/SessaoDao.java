package com.database.repository;

import com.database.model.Sessao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SessaoDao extends JpaRepository<Sessao, Long> {

    List<Sessao> findAllByPeca_Teatro_Id(Long pecaTeatroId);

    Optional<Sessao> findByIdAndPeca_Teatro_Id(Long id, Long pecaTeatroId);

    void deleteByIdAndPeca_Teatro_Id(Long id, Long pecaTeatroId);
}
