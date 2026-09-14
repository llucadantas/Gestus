package com.database.dao;

import com.database.model.Teatro;
import com.dto.response.TeatroResponse;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class TeatroDao{

    @PersistenceContext
    private EntityManager em;

    public void save(Teatro teatro) {
        if (teatro.getId() == null) {
            em.persist(teatro);
            return;
        }
        em.merge(teatro);
    }

    public Teatro findById(Long id) {
        return em.find(Teatro.class, id);
    }

    public TeatroResponse findByIdResponse(Long idTeatro) {
        return em.createQuery("""
        SELECT new com.dto.response.TeatroResponse(t.id, t.nome, t.administrador.id)
        FROM Teatro t
        WHERE t.id = :idTeatro
""", TeatroResponse.class).setParameter("idTeatro", idTeatro).getSingleResult();
    }
}
