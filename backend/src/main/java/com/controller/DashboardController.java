package com.controller;

import com.dto.response.dashboard.DashboardResponse;
import com.services.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public DashboardResponse getDashboard(
            @AuthenticationPrincipal(expression = "idTeatro") Long idTeatro) {

        return dashboardService.getDashboardData(idTeatro);
    }
}