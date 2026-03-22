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

    private Double amount;

    private String merchantId;

    private String merchantCountry;

    private String deviceId;

    private RiskLevel riskLevel;

    private RiskAction action;

    private Double riskScore;

    private Boolean fraud;

    private String reason;

    private LocalDateTime timestamp;

    private List<TransactionHistoryDTO> history;

}