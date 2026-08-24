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
    @Column(name = "mes")
    @Enumerated(EnumType.STRING)
    private Set<Mes> meses = new HashSet<>();

    // Cria uma tabela auxiliar: tb_regra_dia_semana (regra_id, dia_semana)
    @ElementCollection(fetch = FetchType.EAGER)
    @Column(name = "dia_semana")
    @Enumerated(EnumType.STRING)
    private Set<DiaSemana> diasSemana = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teatro_id", nullable = false)
    private Teatro teatro;


    public boolean isAplicavel(LocalDate dataSessao) {

        // Se o Set de meses estiver vazio, significa "Qualquer Mês"
        // Se tiver algo, a data da sessão TEM que estar lá dentro
        boolean mesBate = this.meses.isEmpty() || this.meses.contains(dataSessao.getMonthValue());

        // Mesma lógica para os dias da semana
        boolean diaBate = this.diasSemana.isEmpty() || this.diasSemana.contains(dataSessao.getDayOfWeek().getValue());

        return mesBate && diaBate;
    }

}
