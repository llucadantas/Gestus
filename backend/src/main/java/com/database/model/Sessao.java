package com.database.model;

import com.database.model.enums.StatusSessao;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

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
    @JoinColumn(name = "proposta_aluguel_id")
    private Contrato propostaContrato;

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

    @Column(name = "valor_ingresso")
    private BigDecimal valorIngresso;

    @Builder.Default
    @OneToMany(mappedBy = "sessao", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<AssentoSessao> assentosSessao = new ArrayList<>();

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private StatusSessao statusSessao = StatusSessao.AGUARDANDO_ASSINATURA;

    public Sessao(Contrato propostaContrato, LocalDate dataExibicao,
                  LocalTime horarioInicioPeca, LocalTime horarioFimPeca,
                  BigDecimal valorSessao, BigDecimal valorIngresso) {
        this.propostaContrato = propostaContrato;
        this.dataExibicao = dataExibicao;
        this.horarioInicioPeca = horarioInicioPeca;
        this.horarioFimPeca = horarioFimPeca;
        this.valorSessao = valorSessao;
        this.valorIngresso = valorIngresso;
    }

    @PrePersist
    @PreUpdate
    public void calcularHorariosOcupacao() {
        if (this.horarioInicioPeca != null) {
            this.horarioOcupacaoInicio = this.horarioInicioPeca.minusHours(1);
        }
        if (this.horarioFimPeca != null) {
            this.horarioOcupacaoFim = this.horarioFimPeca.plusHours(1);
        }
    }

    public void addAssento(AssentoSessao assento) {
        assentosSessao.add(assento);
        assento.setSessao(this);
    }

    public void removeAssento(AssentoSessao assento) {
        assentosSessao.remove(assento);
        assento.setSessao(null);
    }
}