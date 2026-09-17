package com.database.model;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

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
    @Column(unique = true, nullable = false)
    private String email;
    @Column(nullable = false)
    private String nome;
    @Column(nullable = false)
    private String senha;

    @OneToOne(mappedBy="administrador", cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    private Teatro teatro;
}
