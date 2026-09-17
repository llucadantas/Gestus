package com.database.model;


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
    @Column(nullable = false)
    private Integer nAssento;
    @Column(nullable = false)
    private String codigoPosicao;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_coluna")
    private Coluna coluna;
}