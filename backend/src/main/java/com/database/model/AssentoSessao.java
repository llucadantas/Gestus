package com.database.model;

import com.database.model.enums.StatusAssento;
import com.database.model.state.assento.EstadoAssento;
import com.database.model.state.assento.EstadoLivre;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "assento_sessao")
@Getter
@Setter
@NoArgsConstructor
public class AssentoSessao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Integer nAssento;
    private String codigoPosicao;

    @Enumerated(EnumType.STRING)
    private StatusAssento estadoAssento = StatusAssento.LIVRE;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_sessao")
    private Sessao sessao;

    private String fileira;

    public AssentoSessao(Assento a){
        this.nAssento = a.getNAssento();
        this.codigoPosicao = a.getCodigoPosicao();
        this.fileira = a.getColuna().getIdentificadorColuna();
    }

    public boolean isDisponivel() {
        if(this.estadoAssento == StatusAssento.LIVRE)
            return true;
        return false;
    }
}
