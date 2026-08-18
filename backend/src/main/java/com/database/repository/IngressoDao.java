package com.database.repository;

import com.database.model.IngressoVendido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IngressoDao extends JpaRepository<IngressoVendido, Long> {
    List<IngressoVendido> findBySessao_Id(Long sessaoId);
}
