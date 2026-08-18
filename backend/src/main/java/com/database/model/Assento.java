package com.database.model;

import com.database.model.state.EstadoAssento;
import com.database.model.state.EstadoInativo;
import com.database.model.state.EstadoLivre;
import com.database.model.state.EstadoOcupado;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "assento")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Assento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer nAssento;
    private String codigoPosicao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_coluna")
    private Coluna coluna;

    @Builder.Default
    @Column(name = "status_assento", nullable = false)
    private String statusDb = "LIVRE";

    @Builder.Default
    @Transient
    private EstadoAssento estadoAtual = new EstadoLivre();


    public void ocupar() {
        this.estadoAtual.ocupar(this);
    }

    public void liberar() {
        this.estadoAtual.liberar(this);
    }

    public void inativar() {
        this.estadoAtual.inativar(this);
    }

    @PostLoad
    private void carregarEstadoEmMemoria() {
        switch (this.statusDb) {
            case "LIVRE" -> this.estadoAtual = new EstadoLivre();
            case "OCUPADO" -> this.estadoAtual = new EstadoOcupado();
            case "INATIVO" -> this.estadoAtual = new EstadoInativo();
            default -> throw new IllegalStateException("Estado de assento desconhecido no banco de dados.");
        }
    }

    @PrePersist
    @PreUpdate
    private void salvarEstadoNoBanco() {
        if (this.estadoAtual != null) {
            this.statusDb = this.estadoAtual.getStatus();
        }
    }
}