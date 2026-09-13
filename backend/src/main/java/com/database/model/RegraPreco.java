package com.database.model;

import com.database.model.enums.DiaSemana;
import com.database.model.enums.Mes;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "regras_preco")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RegraPreco {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 60, nullable = false)
    private String descricao;

    @Column(nullable = false)
    private BigDecimal valor;

    @Builder.Default
    @ElementCollection
    @CollectionTable(name = "regra_dias_semana", joinColumns = @JoinColumn(name = "regra_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "dias", nullable = false)
    private Set<DiaSemana> diasSemana = new HashSet<>();

    @Builder.Default
    @ElementCollection
    @CollectionTable(name = "regra_meses", joinColumns = @JoinColumn(name = "regra_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "meses", nullable = false)
    private Set<Mes> meses = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teatro_id", nullable = false)
    private Teatro teatro;

    public boolean isAplicavel(LocalDate dataSessao) {
        Mes mesSessao = Mes.converterDoJava(dataSessao.getMonth());
        DiaSemana diaSessao = DiaSemana.converterDoJava(dataSessao.getDayOfWeek());

        boolean mesBate = this.meses.isEmpty() || this.meses.contains(mesSessao);
        boolean diaBate = this.diasSemana.isEmpty() || this.diasSemana.contains(diaSessao);

        return mesBate && diaBate;
    }
}