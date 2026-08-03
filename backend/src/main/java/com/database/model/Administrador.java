package com.database.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "administrador")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Administrador {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true)
    private String email;
    private String nome;
    private String senha;

    @OneToOne(mappedBy="administrador", cascade = CascadeType.ALL, orphanRemoval = true)
    private Teatro teatro;


}
