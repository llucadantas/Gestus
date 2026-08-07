package com.services;

import com.database.model.RegraPreco;
import com.database.model.Teatro;
import com.database.model.enums.Turno;
import com.database.repository.RegraPrecoDao;
import com.database.repository.TeatroDao;
import com.dto.requests.RegraRequest;
import com.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class RegrasPrecoService {
    private final TeatroDao teatroDao;
    private final RegraPrecoDao regraPrecoDao;

    public void cadastrarRegraPreco(RegraRequest regraRequest, Long idTeatro) throws NotFoundException {
        Teatro t = teatroDao
                .findById(idTeatro)
                .orElseThrow(()->new NotFoundException("Teatro não encontrado"));

        RegraPreco regraPreco = RegraPreco.builder()
                .preco(regraRequest.valor())
                .mes(regraRequest.mes())
                .turno(regraRequest.turno())
                .diaSemana(regraRequest.dia())
                .build();
        t.getRegras().add(regraPreco);
        teatroDao.save(t);
    }

    public RegraPreco buscarRegraPreco(Long idRegra, Long idTeatro) throws NotFoundException {
        Teatro t = teatroDao
                .findById(idTeatro)
                .orElseThrow(()->new NotFoundException("Teatro não encontrada"));
        for(RegraPreco regraPreco : t.getRegras()){
            if(regraPreco.getId().equals(idRegra)){
                return regraPreco;
            }
        }
        throw new NotFoundException("Regra não existe.");
    }

    public List<RegraPreco> buscarRegras(Long idTeatro) throws NotFoundException {
        return teatroDao
                .findById(idTeatro)
                .orElseThrow(()->new NotFoundException("Teatro não encontrada"))
                .getRegras();
    }

    public void deleteRegraPreco(Long idTeatro, Long idRegraPreco) throws NotFoundException {
        RegraPreco regraPreco = buscarRegraPreco(idRegraPreco, idTeatro);
        regraPrecoDao.delete(regraPreco);
    }

    public BigDecimal obterPrecoAplicavel(LocalDate dataAluguel, Turno turnoAluguel, Long idTeatro) throws NotFoundException {
        List<RegraPreco> todasAsRegras = buscarRegras(idTeatro);

        Optional<BigDecimal> maiorPreco = todasAsRegras.stream()
                .filter(regra -> regra.isAplicavel(dataAluguel, turnoAluguel))
                .map(RegraPreco::getPreco)
                .max(BigDecimal::compareTo);

        return maiorPreco.orElseThrow(() ->
                new IllegalStateException("Nenhuma regra de preço aplicável encontrada para a data e turno informados.")
        );
    }
}
