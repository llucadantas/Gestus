package com.services;

import com.database.dao.DashboardDao;
import com.dto.response.dashboard.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final DashboardDao dashboardDao;

    @Transactional(readOnly = true)
    public DashboardResponse getDashboardData(Long idTeatro) {
        LocalDate today = LocalDate.now();
        LocalDate startOfWeek = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        LocalDate endOfWeek = today.with(TemporalAdjusters.nextOrSame(DayOfWeek.SUNDAY));

        Long ingressosVendidos = dashboardDao.countIngressosVendidos(idTeatro);
        Long alugueisAtivos = dashboardDao.countAlugueisAtivos(idTeatro);
        Long sessoesSemana = dashboardDao.countSessoesNaSemana(idTeatro, startOfWeek, endOfWeek);
        BigDecimal receitaPrevista = dashboardDao.sumReceitaPrevista(idTeatro);

        KpisDto kpis = new KpisDto(
                ingressosVendidos != null ? ingressosVendidos : 0L,
                alugueisAtivos != null ? alugueisAtivos : 0L,
                sessoesSemana != null ? sessoesSemana : 0L,
                receitaPrevista != null ? receitaPrevista : BigDecimal.ZERO
        );

        List<SessaoDestaqueDto> sessoesDestaque = dashboardDao.buscarSessoesDestaque(idTeatro, 5);
        List<AluguelRecenteDto> alugueisRecentes = dashboardDao.buscarAlugueisRecentes(idTeatro, 5);

        return new DashboardResponse(kpis, sessoesDestaque, alugueisRecentes);
    }
}