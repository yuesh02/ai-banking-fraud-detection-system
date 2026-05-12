package com.fraud.detection_core.controller;

import com.fraud.detection_core.dto.*;
import com.fraud.detection_core.service.DashboardService;
import lombok.RequiredArgsConstructor;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.web.bind.annotation.*;
import com.fraud.detection_core.entity.FraudRisk;
import com.fraud.detection_core.service.FraudRingService;
import java.util.List;
import java.util.Map;
@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
@CrossOrigin
public class DashboardController {

    private final DashboardService dashboardService;
    private final FraudRingService fraudRingService;

    @GetMapping("/fraud-rings")
    public List<Map<String, Object>> getFraudRings() {
        return fraudRingService.findFraudRings();
    }

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
public Page<TransactionDetailsDTO> getTransactions(
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {
    return dashboardService.getTransactions(page, size);
}
@GetMapping("/transactions/filter")
public Page<TransactionDetailsDTO> filterTransactions(
        @RequestParam String riskLevel,
        @RequestParam(defaultValue = "0") int page,
        @RequestParam(defaultValue = "10") int size) {

    return dashboardService.getTransactionsByRiskLevel(riskLevel, page, size);
}

@PostMapping("/transactions/search")
public Page<TransactionDetailsDTO> searchTransactions(
        @RequestBody TransactionSearchDTO search
) {
    return dashboardService.searchTransactions(search);
}

@PutMapping("/transactions/{transactionId}/action")
public org.springframework.http.ResponseEntity<?> updateTransactionAction(
        @PathVariable String transactionId,
        @RequestParam com.fraud.detection_core.entity.RiskAction action
) {
    dashboardService.updateTransactionAction(transactionId, action);
    return org.springframework.http.ResponseEntity.ok().build();
}

@GetMapping("/cases/review")
public List<TransactionDetailsDTO> getReviewQueue() {
    return dashboardService.getReviewQueue();
}
}