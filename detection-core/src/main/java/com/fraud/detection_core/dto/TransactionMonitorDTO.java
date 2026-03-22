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
public class TransactionMonitorDTO {

    private String transactionId;

    private String customerId;

    private Double amount;

    private Double riskScore;

    private RiskLevel riskLevel;

    private RiskAction action;

    private Boolean fraud;

    private String reason;

    private LocalDateTime timestamp;

}