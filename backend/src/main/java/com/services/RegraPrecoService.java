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
import java.util.Comparator;
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
                .valor(regraRequest.valor())
                .meses(regraRequest.meses())
                .diasSemana(regraRequest.diasSemana())
                .teatro(t)
                .build();
        regraPrecoDao.save(regraPreco);
    }

    public RegraResponse getRegraResponse(Long idTeatro, Long idRegra) throws NotFoundException {
        if(idTeatro == null) {
            throw new NotFoundException("Teatro não existe");
        }
        RegraPreco r = regraPrecoDao
                .findByIdAndTeatro_Id(idRegra, idTeatro)
                .orElseThrow(() -> new NotFoundException("Regra não encontrada"));
        return new RegraResponse(r);
    }

    public List<RegraResponse> getRegrasListResponse(Long idTeatro) throws NotFoundException {
        if(idTeatro == null) {
            throw new NotFoundException("Teatro não existe");
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
        r.setValor(regraPreco.valor());
        r.setMeses(regraPreco.meses());
        r.setDiasSemana(regraPreco.diasSemana());
        regraPrecoDao.save(r);
    }

    public BigDecimal obterPrecoAplicavel(LocalDate data, Long idTeatro){
        List<RegraPreco> todasAsRegras = getRegrasModel(idTeatro);

        return todasAsRegras.stream()
                .filter(regra -> regra.isAplicavel(data))
                .map(RegraPreco::getValor)
                .max(BigDecimal::compareTo)
                .orElse(BigDecimal.ZERO);
    }

    private List<RegraPreco> getRegrasModel(Long idTeatro){
        return regraPrecoDao.findAllByTeatro_Id(idTeatro);
    }

    private RegraPreco getRegraPreco(Long idTeatro,Long idRegra) throws NotFoundException {
        return regraPrecoDao.findByIdAndTeatro_Id(idRegra, idTeatro)
                .orElseThrow(()-> new NotFoundException("Regra não existe"));
    }
}
