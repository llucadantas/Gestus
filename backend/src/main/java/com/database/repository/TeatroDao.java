package com.database.repository;

import com.database.model.Teatro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeatroDao extends JpaRepository<Teatro, Long> {
}
