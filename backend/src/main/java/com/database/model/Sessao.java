package com.database.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "sessao")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Sessao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "proposta_aluguel_id", nullable = false)
    private Aluguel propostaAluguel;

    @Column(name = "data_exibicao", nullable = false)
    private LocalDate dataExibicao;

    @Column(name = "horario_inicio_peca", nullable = false)
    private LocalTime horarioInicioPeca;

    @Column(name = "horario_fim_peca", nullable = false)
    private LocalTime horarioFimPeca;

    @Column(name = "horario_ocupacao_inicio", nullable = false)
    private LocalTime horarioOcupacaoInicio;

    @Column(name = "horario_ocupacao_fim", nullable = false)
    private LocalTime horarioOcupacaoFim;

    @Column(name = "valor_sessao", nullable = false)
    private BigDecimal valorSessao;

    @Column(name = "valor_ingresso", nullable = false)
    private BigDecimal valorIngresso;

    public Sessao(Aluguel propostaAluguel, LocalDate dataExibicao,
                         LocalTime horarioInicioPeca, LocalTime horarioFimPeca,
                         BigDecimal valorSessao,
                  BigDecimal valorIngresso) {
        this.propostaAluguel = propostaAluguel;
        this.dataExibicao = dataExibicao;
        this.horarioInicioPeca = horarioInicioPeca;
        this.horarioFimPeca = horarioFimPeca;
        this.valorSessao = valorSessao;
        this.valorIngresso = valorIngresso;
    }

    @PrePersist
    @PreUpdate
    private void calcularHorariosDeOcupacao() {
        if (this.horarioInicioPeca != null && this.horarioFimPeca != null) {
            this.horarioOcupacaoInicio = this.horarioInicioPeca.minusHours(1);
            this.horarioOcupacaoFim = this.horarioFimPeca.plusHours(1);
        }
    }
}
