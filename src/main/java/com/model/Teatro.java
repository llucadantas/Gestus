package com.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "teatros")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Teatro {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    @OneToOne
    @JoinColumn(name = "admin_id", referencedColumnName = "id")
    private Administrador administrador;

    @OneToMany(mappedBy = "regras_preco", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RegraPreco> itens = new ArrayList<>();
}
