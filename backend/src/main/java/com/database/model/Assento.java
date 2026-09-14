package com.database.model;

import com.database.model.state.assento.EstadoAssento;
import com.database.model.state.assento.EstadoInativo;
import com.database.model.state.assento.EstadoLivre;
import com.database.model.state.assento.EstadoOcupado;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "assento", uniqueConstraints = {@UniqueConstraint(columnNames = {"n_assento", "id_coluna"})})
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Assento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer nAssento;
    private String codigoPosicao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_coluna")
    private Coluna coluna;
}