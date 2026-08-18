package com.database.model;

import com.database.model.enums.Turno;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

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
    private LocalDate data;
    private Turno turno;
    private BigDecimal valor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "regra_id", nullable = false)
    private RegraPreco regraPreco;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "peca_id", nullable = false)
    private Peca peca;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="artista_id", nullable=false)
    private Artista artista;

}
