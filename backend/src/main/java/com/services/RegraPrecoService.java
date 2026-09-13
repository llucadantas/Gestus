package com.services;

import com.database.model.RegraPreco;
import com.database.model.Teatro;

import com.database.dao.RegraPrecoDao;
import com.dto.requests.RegraRequest;
import com.dto.response.RegraResponse;
import com.exception.NotFoundException;
import com.services.strategy.sessao.ValidadorRegra;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;

import java.util.List;



@Service
@RequiredArgsConstructor
public class RegraPrecoService {
    private final TeatroService teatroService;
    private final RegraPrecoDao regraPrecoDao;
    private final List<ValidadorRegra> validadores;

    @Transactional
    public void cadastrarRegraPreco(RegraRequest regraRequest, Long idTeatro) throws NotFoundException {
        Teatro t = teatroService.getTeatro(idTeatro);

        RegraPreco regraPreco = RegraPreco.builder()
                .valor(regraRequest.valor())
                .meses(regraRequest.meses())
                .diasSemana(regraRequest.diasSemana())
                .descricao(regraRequest.descricao())
                .teatro(t)
                .build();

        regraPrecoDao.save(regraPreco);
    }

    public RegraResponse getRegraResponse(Long idTeatro, Long idRegra) throws NotFoundException {
        if(idTeatro == null) {
            throw new NotFoundException("Teatro não existe");
        }
        return regraPrecoDao
                .findByIdAndTeatro_IdResponse(idRegra, idTeatro)
                .orElseThrow(() -> new NotFoundException("Regra não encontrada"));
    }

    public List<RegraResponse> getRegrasListResponse(Long idTeatro) throws NotFoundException {
        if(idTeatro == null) {
            throw new NotFoundException("Teatro não existe");
        }
        return regraPrecoDao.findAllByTeatro_IdResponse(idTeatro);
    }


    @Transactional
    public void deletarRegraPreco(Long idTeatro, Long idRegraPreco) throws NotFoundException {
        RegraPreco r = getRegraPreco(idTeatro,idRegraPreco);
        regraPrecoDao.delete(r.getId());
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
        if(!regraPrecoDao.existByTeatro_Id(idTeatro)){
            throw new NotFoundException("Nenhuma regra cadastrada");
        }
        for(ValidadorRegra v: validadores){
            v.validar(data, idTeatro);
        }

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
