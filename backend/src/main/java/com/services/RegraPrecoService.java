package com.services;

import com.database.model.RegraPreco;
import com.database.model.Teatro;
import com.database.model.enums.Turno;
import com.database.repository.RegraPrecoDao;
import com.dto.requests.RegraRequest;
import com.dto.response.RegraResponse;
import com.exception.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class RegraPrecoService {
    private final TeatroService teatroService;
    private final RegraPrecoDao regraPrecoDao;

    @Transactional
    public void cadastrarRegraPreco(RegraRequest regraRequest, Long idTeatro) throws NotFoundException {
        Teatro t = teatroService.getTeatro(idTeatro);
        RegraPreco regraPreco = RegraPreco.builder()
                .preco(regraRequest.valor())
                .mes(regraRequest.mes())
                .turno(regraRequest.turno())
                .diaSemana(regraRequest.dia())
                .teatro(t)
                .build();
        regraPrecoDao.save(regraPreco);
    }

    public RegraResponse getRegraResponse(Long idTeatro, Long idRegra) throws NotFoundException {
        if(idTeatro == null) {
            throw new NotFoundException("Teatro não existente");
        }
        RegraPreco r = regraPrecoDao
                .findByIdAndTeatro_Id(idRegra, idTeatro)
                .orElseThrow(() -> new NotFoundException("Regra não encontrada"));
        return new RegraResponse(r);
    }

    public List<RegraResponse> getRegrasListResponse(Long idTeatro) throws NotFoundException {
        if(idTeatro == null) {
            throw new NotFoundException("Teatro não existente");
        }
        return getRegrasModel(idTeatro)
                .stream()
                .map(RegraResponse::new)
                .toList();
    }


    @Transactional
    public void deletarRegraPreco(Long idTeatro, Long idRegraPreco) throws NotFoundException {
        RegraPreco r = getRegraPreco(idTeatro,idRegraPreco);
        regraPrecoDao.deleteById(r.getId());
    }

    @Transactional
    public void atualizarRegra(Long idRegra, Long idTeatro, RegraRequest regraPreco) throws NotFoundException {
        RegraPreco r = getRegraPreco(idTeatro, idRegra);
        r.setPreco(regraPreco.valor());
        r.setMes(regraPreco.mes());
        r.setTurno(regraPreco.turno());
        r.setDiaSemana(regraPreco.dia());
        regraPrecoDao.save(r);
    }

    public List<RegraResponse> obterPrecoAplicavel(LocalDate dataAluguel, Turno turnoAluguel, Long idTeatro){
        List<RegraPreco> todasAsRegras = getRegrasModel(idTeatro);

        return todasAsRegras.stream()
                .filter(regra -> regra.isAplicavel(dataAluguel, turnoAluguel))
                .map(RegraResponse::new)
                .toList();
    }

    private List<RegraPreco> getRegrasModel(Long idTeatro){
        return regraPrecoDao.findAllByTeatro_Id(idTeatro);
    }

    private RegraPreco getRegraPreco(Long idTeatro,Long idRegra) throws NotFoundException {
        return regraPrecoDao.findByIdAndTeatro_Id(idRegra, idTeatro)
                .orElseThrow(()-> new NotFoundException("Regra não existe"));
    }
}
