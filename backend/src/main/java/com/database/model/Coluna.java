package com.database.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "coluna")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class Coluna {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "identificador_coluna")
    private String identificadorColuna;

    @Column(name = "qntd_assento")
    private Integer qntdAssento;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_teatro", nullable = false)
    private Teatro teatro;

    @OneToMany(mappedBy = "coluna", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Assento> assentos;

}
