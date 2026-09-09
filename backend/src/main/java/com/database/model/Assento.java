package com.database.model;

import com.database.model.state.assento.EstadoAssento;
import com.database.model.state.assento.EstadoInativo;
import com.database.model.state.assento.EstadoLivre;
import com.database.model.state.assento.EstadoOcupado;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "assento")
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
    @JsonIgnore
    private Coluna coluna;

    @Builder.Default
    @Column(name = "status_assento", nullable = false)
    private String statusDb = "LIVRE";

    @Builder.Default
    @Column(name = "tipo_assento", nullable = false)
    private String tipoAssento = "PADRAO";
}