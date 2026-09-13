package com.dto.response.dashboard;

import java.math.BigDecimal;

public record KpisDto(
    Long ingressosVendidos,
    Long alugueisAtivos,
    Long sessoesSemana,
    BigDecimal receitaPrevista
) {}