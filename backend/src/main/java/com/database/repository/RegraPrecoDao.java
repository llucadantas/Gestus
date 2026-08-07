package com.database.repository;

import com.database.model.RegraPreco;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RegraPrecoDao extends JpaRepository<RegraPreco,Long> {
}
