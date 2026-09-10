package com.database.model.factory;

import com.database.model.Assento;
import com.database.model.enums.StatusAssento;
import com.database.model.state.assento.EstadoAssento;
import com.database.model.state.assento.EstadoLivre;
import com.database.model.state.assento.EstadoOcupado;

public class EstadoAssentoFactory {
    public static EstadoAssento getEstadoAssento(StatusAssento status){
        return switch (status){
            case LIVRE -> new EstadoLivre();
            case OCUPADO ->  new EstadoOcupado();
        };
    }
}
