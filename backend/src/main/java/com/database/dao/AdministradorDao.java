package com.database.dao;

import com.database.model.Administrador;
import com.dto.response.AdministradorResponse;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class AdministradorDao{

    @PersistenceContext
    private EntityManager em;

    @Transactional
    public Administrador save(Administrador administrador){
        em.persist(administrador);
        administrador.setId(administrador.getId());
        return administrador;
    }

    public Optional<Administrador> findByEmail(String email){
        try{
            Administrador administrador = em.createQuery(
                            """
                                                FROM Administrador a WHERE a.email = :email
                                    """, Administrador.class)
                    .setParameter("email", email)
                    .getSingleResult();
            return Optional.of(administrador);
        }catch(NoResultException noResultException){
            return Optional.empty();
        }
    }

    public Optional<Administrador> findById(Long id){
        try{
            Administrador administrador = em.createQuery(
                            """
                                               FROM Administrador a WHERE a.id = :id
                                    """, Administrador.class)
                    .setParameter("id", id)
                    .getSingleResult();
            return Optional.of(administrador);
        }catch(NoResultException noResultException){
            return Optional.empty();
        }
    }

    public Optional<AdministradorResponse> findByIdResponse(Long id){
        try{
            AdministradorResponse administrador = em.createQuery(
                            """
                                               SELECT new com.dto.response.AdministradorResponse(a.id, a.email, a.nome, a.teatro.nome)  FROM Administrador a WHERE a.id = :id
                                    """, AdministradorResponse.class)
                    .setParameter("id", id)
                    .getSingleResult();
            return Optional.of(administrador);
        }catch(NoResultException noResultException){
            return Optional.empty();
        }
    }





}
