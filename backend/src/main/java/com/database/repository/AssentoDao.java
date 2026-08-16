package com.database.repository;

import com.database.model.Assento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssentoDao extends JpaRepository<Assento, Long> {
    void deleteByColunaAssento_Teatro_Id(Long colunaAssentoTeatroId);

    List<Assento> findByColunaAssento_Teatro_Id(Long id);

}
