package com.services;

import com.database.repository.AluguelDao;
import com.database.repository.IngressoDao;
import com.database.repository.SessaoDao;
import com.database.repository.TeatroDao;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class KPIService {
    private final IngressoDao ingressoDao;
    private final AluguelDao aluguelDao;
    private final TeatroDao teatroDao;
    private final SessaoDao sessaoDao;

    public Integer qntdIngresso(Long idTeatro){
        return ingressoDao.countBySessao_Peca_Teatro_Id(idTeatro);
    }

    public Integer qntdAluguel(){
        return 0;
    }




}
