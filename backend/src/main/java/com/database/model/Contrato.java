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

    @Column(name = "valor_total", nullable = false)
    private BigDecimal valorTotal = BigDecimal.ZERO;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "peca_id", nullable = false)
    private Peca peca;

    @OneToMany(mappedBy = "propostaContrato", orphanRemoval = true, cascade = CascadeType.ALL)
    private List<Sessao> sessoes = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teatro_id", nullable = false)
    private Teatro teatro;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="artista_id", nullable=false)
    private Artista artista;

    @Enumerated(EnumType.STRING)
    private StatusContrato status = StatusContrato.EM_ANALISE;

    private String tokenAssinatura;

    public void gerarTokenAssinatura(){
        this.tokenAssinatura = UUID.randomUUID().toString();
    }

    public void calcularValorTotal() {
        BigDecimal valorTotal = BigDecimal.ZERO;

        for (Sessao sessao : sessoes) {
            valorTotal = valorTotal.add(sessao.getValorSessao());
        }
        setValorTotal(valorTotal);
    }
}

