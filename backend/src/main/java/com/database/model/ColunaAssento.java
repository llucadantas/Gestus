package com.database.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Table(name = "coluna_assento")
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Getter
@Setter
public class ColunaAssento {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "identificador_coluna")
    private String identificadorColuna;

    @Column(name = "qntd_assento")
    private Integer qntdAssentos;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_teatro", nullable = false)
    private Teatro teatro;

    @OneToMany(mappedBy = "colunaAssento", cascade = CascadeType.ALL)
    private List<Assento> assentos;

}
