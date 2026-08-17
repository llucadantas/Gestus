package com.dto.response;

import com.database.model.Coluna;

public record ColunaResponse(String identifcador, Integer qntd) {
    public ColunaResponse(Coluna c){
        this(c.getIdentificadorColuna(), c.getQntdAssento());
    }
}
