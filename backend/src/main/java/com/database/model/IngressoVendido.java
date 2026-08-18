package com.database.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ingresso_vendido")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IngressoVendido {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_sessao", nullable = false)
    private Sessao sessao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_assento", nullable = false)
    private Assento assento;

    // Novo campo para armazenar apenas o e-mail em vez da relação com a tabela Cliente
    @Column(name = "email_comprador", nullable = false)
    private String email;
}