package com.database.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "teatros")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Teatro {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    @OneToOne
    @JoinColumn(name = "admin_id", referencedColumnName = "id")
    private Administrador administrador;

    @OneToMany(mappedBy = "teatro", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RegraPreco> regras = new ArrayList<>();
}
