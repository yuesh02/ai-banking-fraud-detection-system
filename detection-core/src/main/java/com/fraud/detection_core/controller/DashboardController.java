package com.fraud.detection_core.controller;

import com.fraud.detection_core.dto.*;
import com.fraud.detection_core.service.DashboardService;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;
import com.fraud.detection_core.entity.FraudRisk;
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
@GetMapping("/recent-transactions")
public Page<TransactionDetailsDTO> getRecentTransactions() {
    return dashboardService.getRecentTransactions();
}
@GetMapping("/transactions/live")
public List<TransactionMonitorDTO> getLiveTransactions() {
    return dashboardService.getLiveTransactions();
}
@GetMapping("/metrics")
public MetricsDTO getMetrics() {
    return dashboardService.getMetrics();
}
@GetMapping("/risk-distribution")
public List<RiskDistributionDTO> getRiskDistribution() {
    return dashboardService.getRiskDistribution();
}
@GetMapping("/alerts")
public List<FraudRisk> getAlerts() {
    return dashboardService.getAlerts();
}@GetMapping("/transactions/{transactionId}")
public TransactionDetailResponseDTO getTransactionDetails(
        @PathVariable String transactionId
) {
    return dashboardService
            .getTransactionDetails(transactionId);
}
@GetMapping("/transactions")
public Page<FraudRisk> getTransactions(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
    return dashboardService.getTransactions(page, size);
}
@GetMapping("/transactions/filter")
public Page<FraudRisk> filterTransactions(
        @RequestParam String riskLevel,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {

    return dashboardService.getTransactionsByRiskLevel(riskLevel, page, size);
}

@PostMapping("/transactions/search")
public Page<Object> searchTransactions(
        @RequestBody TransactionSearchDTO search
) {
    return dashboardService.searchTransactions(search);
}
}