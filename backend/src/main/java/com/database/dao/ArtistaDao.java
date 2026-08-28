package com.database.dao;

import com.database.model.Artista;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;


import java.util.List;
import java.util.Optional;

@Repository
public class ArtistaDao {
    @PersistenceContext
    private EntityManager em;

    public Optional<Artista> findByEmail(String email) {
        try{
            Artista a = em.createQuery("""
                                        FROM Artista a WHERE a.email = :email
                            """, Artista.class)
                    .setParameter("email", email)
                    .getSingleResult();
            return Optional.of(a);
        }catch (NoResultException n){
            return Optional.empty();
        }

    }

    @Transactional
    public void save(Artista artista) {
        if (artista.getId() == null) {
            em.persist(artista);
        } else {
            em.merge(artista);
        }
    }

    public List<Artista> findAll() {
        return em
                .createQuery("select a from Artista a", Artista.class)
                .getResultList();
    }

    public Optional<Artista> findById(Long id) {
        try{
            Artista a = em.createQuery("""
                                        FROM Artista a WHERE a.id = :id
                            """, Artista.class)
                    .setParameter("id", id)
                    .getSingleResult();
            return Optional.of(a);
        }catch (NoResultException n){
            return Optional.empty();
        }
    }
}
