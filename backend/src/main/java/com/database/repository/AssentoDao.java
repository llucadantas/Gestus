package com.database.repository;

import com.database.model.Assento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssentoDao extends JpaRepository<Assento, Long> {
    void deleteAllByColuna_Teatro_Id(Long colunaTeatroId);

    List<Assento> findAllByColuna_Teatro_Id(Long colunaTeatroId);

}
