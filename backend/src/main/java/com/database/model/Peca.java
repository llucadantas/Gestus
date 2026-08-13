package com.database.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "peca")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Peca {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String descricao;

    @OneToMany(mappedBy = "peca", cascade = CascadeType.ALL)
    private List<Sessao> sessoes = new ArrayList<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_teatro", nullable = false)
    private Teatro teatro;



}
