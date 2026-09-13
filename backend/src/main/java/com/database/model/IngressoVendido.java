package com.database.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

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

    @Column(nullable = false)
    private BigDecimal valor;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_sessao", nullable = false)
    private Sessao sessao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_assento", nullable = false)
    private AssentoSessao assentoSessao;

    @Column(name = "email_comprador", nullable = false)
    private String email;

    @Column(name = "nome_cliente")
    private String nomeCliente;
}