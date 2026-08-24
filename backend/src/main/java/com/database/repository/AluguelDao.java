package com.database.repository;

import com.database.model.Aluguel;
import com.dto.response.ContratoAluguelResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AluguelDao extends JpaRepository<Aluguel, Long> {


   Optional<Aluguel> findByIdAndTeatro_Id(Long idAluguel, Long idTeatro);

   List<Aluguel> findByTeatro_Id(Long idTeatro);


}
