package com.fraud.detection_core.dto;

import com.fraud.detection_core.entity.RiskAction;
import com.fraud.detection_core.entity.RiskLevel;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TransactionDetailResponseDTO {

    private String transactionId;
    private String customerId;

    // ── Transaction fields ──────────────────────────────
    private String accountId;
    private String transactionType;
    private String channel;
    private Double amount;
    private String currency;

    // ── Merchant fields ─────────────────────────────────
    private String merchantId;
    private String merchantCategory;
    private String merchantCountry;

    // ── Customer location & device ──────────────────────
    private String customerCountry;
    private String deviceId;
    private String ipAddress;

    // ── Risk fields ─────────────────────────────────────
    private RiskLevel riskLevel;
    private RiskAction action;
    private Double riskScore;
    private Boolean fraud;
    private String reason;

    private LocalDateTime timestamp;
    private List<TransactionHistoryDTO> history;

}