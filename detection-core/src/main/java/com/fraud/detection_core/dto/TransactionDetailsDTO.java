package com.fraud.detection_core.dto;

import com.fraud.detection_core.entity.RiskAction;
import com.fraud.detection_core.entity.RiskLevel;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TransactionDetailsDTO {

    private String transactionId;

    private String customerId;

    private String customerName;

    private Double amount;

    private String merchantId;

    private String merchantCountry;

    private String deviceId;

    private Double riskScore;

    private RiskLevel riskLevel;

    private RiskAction action;

    private Boolean fraud;

    private String reason;

    private LocalDateTime timestamp;

}