package com.dto.response;
import com.database.model.Assento;
import com.database.model.Coluna;

import java.util.List;

public record ColunaResponse(Long id,String identificador, Integer qntd, List<Assento> assentos) {
    public ColunaResponse(Coluna c){
        this(c.getId(),c.getIdentificadorColuna(), c.getQntdAssento(), c.getAssentos());
    }
}
