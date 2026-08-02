package com.model;

import com.model.enums.DiaSemana;
import com.model.enums.Mes;
import com.model.enums.Turno;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "regras_preco")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RegraPreco {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Double preco;
    @Enumerated(EnumType.STRING)
    private DiaSemana diaSemana;
    private Mes mes;
    @Enumerated(EnumType.STRING)
    private Turno turno;
    @Enumerated(EnumType.STRING)
    private Integer intervaloHoras;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teatro_id", nullable = false)
    private Teatro teatro;

}
