package com.database.dao;

import com.database.model.Sessao;
import com.dto.response.SessaoProjection;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public class SessaoDao {

    @PersistenceContext
    private EntityManager em;

    public List<Sessao> findAllByPropostaAluguel_Teatro_Id(Long idTeatro) {
        TypedQuery<Sessao> query = em.createQuery(
                """
    FROM Sessao s where s.propostaContrato.teatro = :idTeatro
""", Sessao.class
        ).setParameter("idTeatro", idTeatro);
        return query.getResultList();
    }


    public Optional<Sessao> findByIdAndPropostaAluguel_Teatro_Id(Long id, Long idTeatro) {
        try{
            TypedQuery<Sessao> query = em.createQuery("""
            FROM Sessao s WHERE s.id = :id AND s.propostaContrato.teatro.id = :idTeatro
            """, Sessao.class)
                    .setParameter("id", id)
                    .setParameter("idTeatro", idTeatro);
            return Optional.of(query.getSingleResult());
        }catch(NoResultException e){
            return Optional.empty();
        }
    }

    public boolean existeConflitoHorario(
            Long idTeatro,
            LocalDate data,
            LocalTime ocupacaoInicio,
            LocalTime ocupacaoFim) {
        TypedQuery<Boolean> query = em.createQuery(
                        """
                SELECT COUNT(s) > 0 
                FROM Sessao s
                WHERE s.propostaContrato.teatro.id = :idTeatro
                AND s.dataExibicao = :data
                AND s.horarioOcupacaoInicio < :ocupacaoFim
                AND s.horarioOcupacaoFim > :ocupacaoInicio
        """, Boolean.class)
                .setParameter("idTeatro", idTeatro)
                .setParameter("data", data)
                .setParameter("ocupacaoInicio", ocupacaoInicio)
                .setParameter("ocupacaoFim", ocupacaoFim);

        return query.getSingleResult();
    }



    public Page<SessaoProjection> buscarSessoesRecentes(Long idTeatro, int pagina, int tamanho) {
        Pageable pageable = PageRequest.of(pagina, tamanho);

        TypedQuery<SessaoProjection> query = em.createQuery(
                        """
                        SELECT new com.dto.response.SessaoProjection(
                            s.propostaContrato.peca.nome,
                            s.horarioInicioPeca,
                            s.horarioFimPeca,
                            s.dataExibicao,
                            s.propostaContrato.artista.nome
                        ) 
                        FROM Sessao s 
                        WHERE s.propostaContrato.teatro.id = :idTeatro and s.statusSessao = StatusSessao.CONFIRMADO
                        ORDER BY s.dataExibicao ASC, s.horarioInicioPeca ASC
                        """, SessaoProjection.class)
                .setParameter("idTeatro", idTeatro);

        query.setFirstResult((int) pageable.getOffset());
        query.setMaxResults(pageable.getPageSize());

        List<SessaoProjection> content = query.getResultList();

        Long totalElements = em.createQuery(
                        "SELECT COUNT(s) FROM Sessao s WHERE s.propostaContrato.teatro.id = :idTeatro and s.statusSessao = StatusSessao.CONFIRMADO", Long.class)
                .setParameter("idTeatro", idTeatro)
                .getSingleResult();

        return new PageImpl<>(content, pageable, totalElements);
    }
}

