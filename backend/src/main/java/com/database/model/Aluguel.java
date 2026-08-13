package com.database.model;

import com.database.model.enums.Turno;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "aluguel")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
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
    @JoinColumn(name="artista_id", nullable=false)
    private Artista artista;

    public Aluguel(LocalDate data, Turno turno, RegraPreco regraPreco, Artista artista) {
        this.data = data;
        this.turno = turno;
        this.regraPreco = regraPreco;
        this.artista = artista;
        this.valor = this.regraPreco.getPreco();
    }

}
