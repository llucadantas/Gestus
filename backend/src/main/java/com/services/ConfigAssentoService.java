package com.services;

import com.database.model.Assento;
import com.database.model.ConfigAssento;
import com.database.repository.ConfigAssentoDao;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ConfigAssentoService {
    private final ConfigAssentoDao confiDao;

    public List<Assento> criarAssentos(Long idTeatro){
        List<Assento> assentos = new ArrayList<>();
        List<ConfigAssento> configAssentos = confiDao.findAllByTeatro_Id(idTeatro);
        for(ConfigAssento configAssento : configAssentos){
            for(int i = 1; i <= configAssento.getQntdAssentos(); i++){
                Assento a = Assento.builder()
                        .nAssento(i)
                        .codigoPosicao(configAssento.getIdentificadorColuna() + "-" + i)
                        .build();
                assentos.add(a);
                configAssento.getAssentos().add(a);
            }
            confiDao.save(configAssento);
        }
        return assentos;
    }

}
