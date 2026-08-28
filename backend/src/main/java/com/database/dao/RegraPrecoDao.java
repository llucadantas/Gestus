package com.database.dao;

import com.database.model.RegraPreco;
import com.dto.response.RegraResponse;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class RegraPrecoDao {

    @PersistenceContext
    private EntityManager em;

    @Transactional
    public void save(RegraPreco r) {
        if (r.getId() == null) {
            em.persist(r);
        } else {
            em.merge(r);
        }
    }

    public List<RegraPreco> findAllByTeatro_Id(Long idTeatro) {
        TypedQuery<RegraPreco> query = em.createQuery("""
            from RegraPreco a WHERE a.teatro.id = :idTeatro
                """, RegraPreco.class);
        query.setParameter("idTeatro", idTeatro);
        return query.getResultList();
    }

    public Optional<RegraPreco> findByIdAndTeatro_Id(Long idRegra, Long idTeatro) {
        try{
            RegraPreco regra = em.createQuery("""
            from RegraPreco a WHERE a.teatro.id = :idTeatro and a.id = :idRegra
                """, RegraPreco.class)
                    .setParameter("idTeatro", idTeatro)
                    .setParameter("idRegra", idRegra)
                    .getSingleResult();
            return Optional.of(regra);
        } catch (NoResultException e) {
            return Optional.empty();
        }
    }

    public Optional<RegraResponse> findByIdAndTeatro_IdResponse(Long idRegra, Long idTeatro) {
        try{
            RegraResponse regra = em.createQuery("""
            SELECT new com.dto.response.RegraResponse(a)  from RegraPreco a WHERE a.teatro.id = :idTeatro and a.id = :idRegra
                """, RegraResponse.class)
                    .setParameter("idTeatro", idTeatro)
                    .setParameter("idRegra", idRegra)
                    .getSingleResult();
            return Optional.of(regra);
        } catch (NoResultException e) {
            return Optional.empty();
        }
    }


    public List<RegraResponse> findAllByTeatro_IdResponse(Long idTeatro) {
        TypedQuery<RegraResponse> query = em.createQuery("""
            SELECT new com.dto.response.RegraResponse(a) from RegraPreco a WHERE a.teatro.id = :idTeatro
                """, RegraResponse.class);
        query.setParameter("idTeatro", idTeatro);
        return query.getResultList();
    }

    @Transactional
    public void delete(Long id) {
        em.remove(em.find(RegraPreco.class, id));
    }

    public boolean existByTeatro_Id(Long idTeatro) {
        TypedQuery<Long> query = em.createQuery(
                """
                            SELECT COUNT(r) from  RegraPreco a WHERE a.teatro.id = :idTeatro
                        """, Long.class);
        query.setParameter("idTeatro", idTeatro);
        return query.getSingleResult() > 0;
    }

}