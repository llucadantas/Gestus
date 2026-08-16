package com.dto.response;

import com.database.model.ColunaAssento;

public record ColunaResponse(String identificadorColuna, Integer qntdAssentos) {
    public ColunaResponse(ColunaAssento c){
        this(c.getIdentificadorColuna(), c.getQntdAssentos());
    }
}
