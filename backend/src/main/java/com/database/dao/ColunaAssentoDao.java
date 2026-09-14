package com.database.dao;

import com.database.model.Coluna;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Repository
public class ColunaAssentoDao {

    @PersistenceContext
    private EntityManager em;

    @Transactional
    public void save(Coluna coluna) {
        if (coluna.getId() == null) {
            em.persist(coluna);
        } else {
            em.merge(coluna);
        }
    }

    @Transactional
    public void saveAll(Set<Coluna> colunas) {
        for (Coluna coluna : colunas) {
            em.persist(coluna);
        }
    }

    @Transactional
    public void delete(Coluna coluna) {
        em.remove(coluna);
    }

    public  List<Coluna> findAllByTeatro_Id(Long idTeatro) {
        return em.createQuery(" from Coluna c left join fetch c.assentos where c.teatro.id = :idTeatro", Coluna.class)
                .setParameter("idTeatro", idTeatro)
                .getResultList();
    }

    public Optional<Coluna> findByIdAndTeatro_Id(Long idColuna, Long idTeatro) {
        return Optional.of(em.createQuery("from Coluna c where c.id =:idColuna and c.teatro.id = :idTeatro", Coluna.class)
                .setParameter("idColuna", idColuna)
                .setParameter("idTeatro", idTeatro)
                .getSingleResult());
    }


}
