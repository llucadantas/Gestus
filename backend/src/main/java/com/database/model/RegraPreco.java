package com.database.model;

import com.database.model.enums.DiaSemana;
import com.database.model.enums.Mes;
import com.database.model.enums.Turno;
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
    @Enumerated(EnumType.STRING)
    private Mes mes;
    @Enumerated(EnumType.STRING)
    private Turno turno;
    private Integer intervaloHoras;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teatro_id", nullable = false)
    private Teatro teatro;

}
