package com.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "administrador")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Administrador {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true)
    private String email;
    private String nome;
    private String senha;

    @OneToOne(mappedBy="teatro", cascade = CascadeType.ALL, orphanRemoval = true)
    private Teatro teatro;


}
