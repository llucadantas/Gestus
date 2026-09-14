package com.database.dao;

import com.database.model.IngressoVendido;
import com.dto.response.IngressoVendidoResponse;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class IngressoDao {

    @PersistenceContext
    private EntityManager em;

    public void save(IngressoVendido ingressoVendido){
        em.persist(ingressoVendido);
    }

    public List<IngressoVendidoResponse> findByEmail(String email){
        return em.createQuery("""
        SELECT new com.dto.response.IngressoVendidoResponse(ingresso.id, ingresso.assentoSessao.id, ingresso.email, ingresso.assentoSessao.codigoPosicao)
        FROM IngressoVendido ingresso
        JOIN ingresso.assentoSessao
        where ingresso.email = :email
""", IngressoVendidoResponse.class).setParameter("email", email).getResultList();
    }

    public List<IngressoVendidoResponse> findByTeatroId(Long idTeatro){
        return em.createQuery("""
        SELECT new com.dto.response.IngressoVendidoResponse(ingresso.id, ingresso.assentoSessao.id, ingresso.email, ingresso.assentoSessao.codigoPosicao)
        FROM IngressoVendido ingresso
        JOIN ingresso.assentoSessao assento
        where assento.sessao.propostaContrato.teatro.id = :idTeatro
""", IngressoVendidoResponse.class).setParameter("idTeatro", idTeatro).getResultList();
    }

}
