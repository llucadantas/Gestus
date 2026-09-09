package com.database.dao;

import com.database.model.Assento;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class AssentoDao {
    @PersistenceContext
    private EntityManager em;

    public void save(Assento assento){
        if(assento.getId()==null){
            em.persist(assento);
            return;
        }
        em.merge(assento);
    }

    public List<Assento> findAllByTeatroId(Long idTeatro){
        TypedQuery<Assento> query = em.createQuery("""
            from Assento a where a.coluna.teatro.id = :idTeatro
""", Assento.class);
        query.setParameter("idTeatro", idTeatro);
        return query.getResultList();
    }

    public Optional<Assento> findByIdAndIdTeatro(Long id, Long idTeatro){
        try{
            TypedQuery<Assento> query = em.createQuery("""
            from Assento a where a.coluna.teatro.id = :idTeatro AND a.id = :id
""", Assento.class);
            query.setParameter("idTeatro", idTeatro);
            query.setParameter("id", id);
            return Optional.of(query.getSingleResult());
        }catch(Exception e){
            return Optional.empty();
        }
    }

}
