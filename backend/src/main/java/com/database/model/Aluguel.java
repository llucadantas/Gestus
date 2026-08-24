package com.database.model;

import com.database.model.enums.Turno;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "aluguel")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Aluguel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "valor_total", nullable = false)
    private BigDecimal valorTotal;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "peca_id", nullable = false)
    private Peca peca;

    @OneToMany(mappedBy = "propostaAluguel", cascade = CascadeType.ALL)
    private List<Sessao> sessoes = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teatro_id", nullable = false)
    private Teatro teatro;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="artista_id", nullable=false)
    private Artista artista;

    public Aluguel(Peca peca) {
        this.peca = peca;
    }

    @PrePersist
    @PreUpdate
    public void calcularValorTotal() {
        BigDecimal valorTotal = BigDecimal.ZERO;

        for (Sessao sessao : sessoes) {
            valorTotal = valorTotal.add(sessao.getValorSessao());
        }
    }



}
