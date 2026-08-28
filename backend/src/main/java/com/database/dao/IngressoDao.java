package com.database.dao;

import com.database.model.IngressoVendido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IngressoDao extends JpaRepository<IngressoVendido, Long> {

}
