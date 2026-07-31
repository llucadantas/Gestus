package com.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "ingresso_vendido")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class IngressoVendido {
    @Id
    private Long id;
    @ManyToOne
    @JoinColumn(name = "cliente_id",  nullable = false)
    private Cliente cliente;
    @ManyToOne
    @JoinColumn(name = "peca_id",  nullable = false)
    private Peca peca;
}
