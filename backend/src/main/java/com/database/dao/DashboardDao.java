package com.database.dao;

import com.dto.response.dashboard.AluguelRecenteDto;
import com.dto.response.dashboard.SessaoDestaqueDto;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Repository
public class DashboardDao {

    @PersistenceContext
    private EntityManager em;

    public Long countIngressosVendidos(Long idTeatro) {
        return em.createQuery("SELECT COUNT(i) FROM IngressoVendido i WHERE i.assentoSessao.sessao.propostaContrato.teatro.id = :idTeatro", Long.class)
                .setParameter("idTeatro", idTeatro)
                .getSingleResult();
    }

    public Long countAlugueisAtivos(Long idTeatro) {
        return em.createQuery("SELECT COUNT(c) FROM Contrato c WHERE c.teatro.id = :idTeatro AND c.status = 'ATIVO'", Long.class)
                .setParameter("idTeatro", idTeatro)
                .getSingleResult();
    }

    public Long countSessoesNaSemana(Long idTeatro, LocalDate startOfWeek, LocalDate endOfWeek) {
        return em.createQuery("SELECT COUNT(s) FROM Sessao s WHERE s.propostaContrato.teatro.id = :idTeatro AND s.dataExibicao BETWEEN :start AND :end AND s.statusSessao != 'CANCELADO'", Long.class)
                .setParameter("idTeatro", idTeatro)
                .setParameter("start", startOfWeek)
                .setParameter("end", endOfWeek)
                .getSingleResult();
    }

    public BigDecimal sumReceitaPrevista(Long idTeatro) {
        BigDecimal sum = em.createQuery("SELECT SUM(c.valorTotal) FROM Contrato c WHERE c.teatro.id = :idTeatro AND c.status != 'CANCELADO'", BigDecimal.class)
                .setParameter("idTeatro", idTeatro)
                .getSingleResult();
        return sum != null ? sum : BigDecimal.ZERO;
    }

    public List<SessaoDestaqueDto> buscarSessoesDestaque(Long idTeatro, int limit) {
        return em.createQuery("SELECT new com.dto.response.dashboard.SessaoDestaqueDto(c.peca.nome, c.artista.nome, s.dataExibicao, s.horarioInicioPeca) FROM Sessao s JOIN s.propostaContrato c WHERE c.teatro.id = :idTeatro AND s.dataExibicao >= CURRENT_DATE and s.statusSessao = StatusSessao.CONFIRMADO ORDER BY s.dataExibicao ASC, s.horarioInicioPeca ASC", SessaoDestaqueDto.class)
                .setParameter("idTeatro", idTeatro)
                .setMaxResults(limit)
                .getResultList();
    }

    public List<AluguelRecenteDto> buscarAlugueisRecentes(Long idTeatro, int limit) {
        return em.createQuery("SELECT new com.dto.response.dashboard.AluguelRecenteDto(c.id, c.peca.nome, MIN(s.dataExibicao), MAX(s.dataExibicao), c.valorTotal, c.status) FROM Contrato c LEFT JOIN c.sessoes s WHERE c.teatro.id = :idTeatro GROUP BY c.id, c.peca.nome, c.valorTotal, c.status ORDER BY c.id DESC", AluguelRecenteDto.class)
                .setParameter("idTeatro", idTeatro)
                .setMaxResults(limit)
                .getResultList();
    }
}