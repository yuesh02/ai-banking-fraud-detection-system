package com.fraud.detection_core.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class DashboardSummaryDTO {

    private Long totalTransactions;
    private Long totalFrauds;
    private Double fraudRate;
    private Double totalAmount;
    private Double averageRiskScore;
}