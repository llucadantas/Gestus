package com.database.dao;

import com.database.model.Peca;
import com.dto.response.PecaResponse;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;


import java.util.List;
import java.util.Optional;

@Repository
public class PecaDao {
    @PersistenceContext
    private EntityManager em;

    @Transactional
    public void save(Peca peca){
        if(peca.getId()==null){
            em.persist(peca);
            return;
        }
        em.merge(peca);
    }

    public Optional<Peca> findById(Long id){
        try {Peca p = em.createQuery("select p from Peca p where p.id=:id", Peca.class)
                    .setParameter("id", id)
                    .getSingleResult();
            return Optional.of(p);
        }catch (NoResultException e){
            return Optional.empty();
        }
    }

    public List<PecaResponse> findAll(){
        return em.createQuery("select new com.dto.response.PecaResponse(p.id, p.nome, p.descricao) from Peca p", PecaResponse.class).getResultList();
    }
}