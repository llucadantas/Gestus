package com.database.dao;

import com.database.model.Aluguel;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class AluguelDao {

   @PersistenceContext
   private EntityManager em;

   @Transactional
   public void save(Aluguel aluguel) {
      if (aluguel.getId() == null) {
         em.persist(aluguel);
      } else {
         em.merge(aluguel);
      }
   }

   public List<Aluguel> findAllByTeatro_Id(Long idTeatro) {
      TypedQuery<Aluguel> query = em.createQuery("""
            from Aluguel a WHERE a.teatro.id = :idTeatro
                """, Aluguel.class);
      query.setParameter("idTeatro", idTeatro);
      return query.getResultList();
   }

   public Optional<Aluguel> findByIdAndTeatro_Id(Long idAluguel, Long idTeatro) {
      try{
         Aluguel aluguel = em.createQuery("""
            from Aluguel a WHERE a.teatro.id = :idTeatro and a.id = :idAluguel
                """, Aluguel.class)
                 .setParameter("idTeatro", idTeatro)
                 .setParameter("idAluguel", idAluguel)
                 .getSingleResult();
         return Optional.of(aluguel);
      } catch (NoResultException e) {
         return Optional.empty();
      }

   }


   }

