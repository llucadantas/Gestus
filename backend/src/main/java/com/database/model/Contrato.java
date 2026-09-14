package com.database.model;

import com.database.model.enums.StatusContrato;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "contrato")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Contrato {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Builder.Default
    @Column(name = "valor_total", nullable = false)
    private BigDecimal valorTotal = BigDecimal.ZERO;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "peca_id", nullable = false)
    private Peca peca;

    @Builder.Default
    @OneToMany(mappedBy = "propostaContrato", orphanRemoval = true, cascade = CascadeType.ALL)
    private List<Sessao> sessoes = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teatro_id", nullable = false)
    private Teatro teatro;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="artista_id", nullable=false)
    private Artista artista;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    private StatusContrato status = StatusContrato.EM_ANALISE;

    private String tokenAssinatura;

    public void gerarTokenAssinatura() {
        this.tokenAssinatura = UUID.randomUUID().toString();
    }

    public void calcularValorTotal() {
        BigDecimal total = BigDecimal.ZERO;
        for (Sessao sessao : sessoes) {
            if (sessao.getValorSessao() != null) {
                total = total.add(sessao.getValorSessao());
            }
        }
        this.valorTotal = total;
    }

    public void addSessao(Sessao sessao) {
        sessoes.add(sessao);
        sessao.setPropostaContrato(this);
    }

    public void removeSessao(Sessao sessao) {
        sessoes.remove(sessao);
        sessao.setPropostaContrato(null);
    }
}