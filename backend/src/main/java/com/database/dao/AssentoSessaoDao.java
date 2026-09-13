package com.database.dao;

import com.database.model.AssentoSessao;
import com.database.model.enums.StatusAssento;
import com.database.model.state.assento.EstadoAssento;
import com.dto.response.AssentoSessaoResponse;
import com.exception.ConcorrenciaAssentoException;
import com.exception.NotFoundException;
import jakarta.persistence.EntityManager;
import jakarta.persistence.LockModeType;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class AssentoSessaoDao {
    @PersistenceContext
    private EntityManager em;

    @Transactional
    public AssentoSessao findByIdWithLock(Long id, Long idTeatro){
        AssentoSessao s = em.createQuery("""
        from AssentoSessao assento
        JOIN FETCH assento.sessao s
        where assento.id = :id and s.propostaContrato.teatro.id = :idTeatro
""", AssentoSessao.class)
                .setLockMode(LockModeType.PESSIMISTIC_WRITE)
                .setParameter("id", id)
                .setParameter("idTeatro", idTeatro).getSingleResult();

        if(s==null){
            throw new NotFoundException("Assento nao existe");
        }
        if(s.getEstadoAssento() == StatusAssento.OCUPADO ||  s.getEstadoAssento() == StatusAssento.RESERVADO){
            throw new ConcorrenciaAssentoException("Assento ocupado ou reservado por outro cliente.");
        }
        s.setEstadoAssento(StatusAssento.RESERVADO);
        return s;
    }
}
