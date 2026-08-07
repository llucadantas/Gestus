package com.database.model;

import com.database.model.enums.DiaSemana;
import com.database.model.enums.Mes;
import com.database.model.enums.Turno;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.Month;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "regras_preco")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class RegraPreco {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private BigDecimal preco;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "dias_semana",
            joinColumns = @JoinColumn(name = "regra_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "dia_semana")
    private Set<DayOfWeek> diaSemana = new HashSet<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "mes",
            joinColumns = @JoinColumn(name = "regra_id"))
    @Enumerated(EnumType.STRING)
    private Set<Month> mes =  new HashSet<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "turno",
            joinColumns = @JoinColumn(name = "regra_id"))
    @Enumerated(EnumType.STRING)
    private Set<Turno> turno =  new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teatro_id", nullable = false)
    private Teatro teatro;

    public boolean isAplicavel(LocalDate dataAluguel, Turno turnoAluguel) {

        Month mesAluguel = dataAluguel.getMonth();
        DayOfWeek diaSemanaAluguel = dataAluguel.getDayOfWeek();

        if (!this.mes.isEmpty() && !this.mes.contains(mesAluguel)) {
            return false;
        }
        if (!this.diaSemana.isEmpty() && !this.diaSemana.contains(diaSemanaAluguel)) {
            return false;
        }
        if (!this.turno.isEmpty() && !this.turno.contains(turnoAluguel)) {
            return false;
        }
        return true;
    }
}
