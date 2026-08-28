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

    private String descricao;

    private BigDecimal valor;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "regra_dias_semana", joinColumns = @JoinColumn(name = "regra_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "dia")
    private Set<DiaSemana> diasSemana;

    // CORRETO: Cria a tabela "regra_meses" e salva como String
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "regra_meses", joinColumns = @JoinColumn(name = "regra_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "mes")
    private Set<Mes> meses;

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
