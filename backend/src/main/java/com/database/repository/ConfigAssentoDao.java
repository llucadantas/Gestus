package com.database.repository;

import com.database.model.Assento;
import com.database.model.ConfigAssento;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConfigAssentoDao extends JpaRepository<ConfigAssento, Long> {

    List<ConfigAssento> findAllByTeatro_Id(Long teatroId);

}
