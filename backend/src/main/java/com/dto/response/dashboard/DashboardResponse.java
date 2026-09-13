package com.dto.response.dashboard;

import java.util.List;

public record DashboardResponse(
    KpisDto kpis,
    List<SessaoDestaqueDto> sessoesDestaque,
    List<AluguelRecenteDto> alugueisRecentes
) {}