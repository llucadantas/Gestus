package com.database.dao;

import com.database.model.Contrato;
import com.dto.response.ContratoAluguelResponse;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class ContratoDao {

   @PersistenceContext
   private EntityManager em;

   @Transactional
   public void save(Contrato contrato) {
      if (contrato.getId() == null) {
         em.persist(contrato);

      } else {
         em.merge(contrato);
      }
   }

   public List<ContratoAluguelResponse> findAllByTeatro_Id(Long idTeatro) {
      TypedQuery<Contrato> query = em.createQuery(""" 
            
              SELECT c FROM Contrato c
                      JOIN FETCH c.peca
                      JOIN FETCH c.artista
                      LEFT JOIN FETCH c.sessoes
                      WHERE c.teatro.id = :idTeatro
            """, Contrato.class);
      query.setParameter("idTeatro", idTeatro);
      return query.getResultList().stream()
              .map(ContratoAluguelResponse::new)
              .toList();
   }

   public Optional<ContratoAluguelResponse> findByIdAndTeatro_IdResponse(Long idAluguel, Long idTeatro) {
      try{
         ContratoAluguelResponse contrato = em.createQuery("""
            SELECT new com.dto.response.ContratoAluguelResponse(c) from Contrato c
            JOIN FETCH c.peca
            JOIN FETCH c.artista
            JOIN FETCH c.sessoes
            WHERE c.teatro.id = :idTeatro and c.id = :idAluguel
                """, ContratoAluguelResponse.class)
                 .setParameter("idTeatro", idTeatro)
                 .setParameter("idAluguel", idAluguel)
                 .getSingleResult();
         return Optional.of(contrato);
      } catch (NoResultException e) {
         return Optional.empty();
      }
   }
   public Optional<Contrato> findByIdAndTeatro_Id(Long idAluguel, Long idTeatro) {
      try{
         Contrato contrato = em.createQuery("""
            from Contrato c
            JOIN FETCH c.peca
            JOIN FETCH c.artista
            JOIN FETCH c.sessoes
            WHERE c.teatro.id = :idTeatro and c.id = :idAluguel
                """, Contrato.class)
                 .setParameter("idTeatro", idTeatro)
                 .setParameter("idAluguel", idAluguel)
                 .getSingleResult();
         return Optional.of(contrato);
      } catch (NoResultException e) {
         return Optional.empty();
      }
   }

   public Optional<Contrato> findByTokenAssinatura(String token){
         try{
            Contrato contrato = em.createQuery("""
            from Contrato a WHERE a.tokenAssinatura = :token
                """, Contrato.class)
                    .setParameter("token", token)
                    .getSingleResult();
            return Optional.of(contrato);
         } catch (NoResultException e) {
            return Optional.empty();
         }
   }

   @Transactional
   public void delete(Long idAluguel) {
      em.remove(em.find(Contrato.class, idAluguel));
   }

   public List<Contrato> findAllStatusAtivoAndStatusEmAnalise() {
      TypedQuery<Contrato> query = em.createQuery(""" 
            from Contrato a WHERE a.status = "ATIVO" and a.status = "EM_ANALISE"
                """, Contrato.class);
      return query.getResultList();
   }
}

