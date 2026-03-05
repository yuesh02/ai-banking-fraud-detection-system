package com.fraud.detection_core.controller;

import com.fraud.detection_core.dto.*;
import com.fraud.detection_core.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
@CrossOrigin
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public DashboardSummaryDTO getSummary() {
        return dashboardService.getSummary();
    }

    @GetMapping("/fraud-trend")
    public List<FraudTrendDTO> getFraudTrend() {
        return dashboardService.getFraudTrend();
    }

    @GetMapping("/top-risky-merchants")
    public List<MerchantRiskDTO> getTopRiskyMerchants() {
        return dashboardService.getTopRiskyMerchants();
    }

    @GetMapping("/risk-by-country")
    public List<CountryRiskDTO> getRiskByCountry() {
        return dashboardService.getRiskByCountry();
    }
    
}