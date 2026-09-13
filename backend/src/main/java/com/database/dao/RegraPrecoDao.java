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
        try {
            // 1. Busca a Entidade pura com DISTINCT
            RegraPreco regra = em.createQuery("""
            SELECT r
            FROM RegraPreco r
            LEFT JOIN FETCH r.meses
            LEFT JOIN FETCH r.diasSemana
            WHERE r.teatro.id = :idTeatro AND r.id = :idRegra
            """, RegraPreco.class)
                    .setParameter("idTeatro", idTeatro)
                    .setParameter("idRegra", idRegra)
                    .getSingleResult();

            // 2. Mapeia para o DTO usando o Java
            return Optional.of(new RegraResponse(regra));

        } catch (NoResultException e) {
            return Optional.empty();
        }
    }


    public List<RegraResponse> findAllByTeatro_IdResponse(Long idTeatro) {
        // 1. Busca as entidades puras, usando DISTINCT e LEFT JOIN
        TypedQuery<RegraPreco> query = em.createQuery("""
        SELECT DISTINCT r
        FROM RegraPreco r
        LEFT JOIN FETCH r.meses
        LEFT JOIN FETCH r.diasSemana
        WHERE r.teatro.id = :idTeatro
        """, RegraPreco.class);

        query.setParameter("idTeatro", idTeatro);

        // 2. Converte a lista de entidades para a lista de DTOs usando Streams
        return query.getResultList().stream()
                .map(RegraResponse::new)
                .toList();
    }

    @Transactional
    public void delete(Long id) {
        em.remove(em.find(RegraPreco.class, id));
    }

    public boolean existByTeatro_Id(Long idTeatro) {
        TypedQuery<Long> query = em.createQuery(
                """
                            SELECT COUNT(r) from RegraPreco r WHERE r.teatro.id = :idTeatro GROUP BY r.teatro.id
                        """, Long.class);
        query.setParameter("idTeatro", idTeatro);
        return query.getSingleResult() > 0;
    }

}