package com.fraud.detection_core.dto;

import com.fraud.detection_core.entity.RiskLevel;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TransactionSearchDTO {

    private String uuid; // Previously transactionId
    private String customerId;
    private String merchantId;
    private String accountId;

    private LocalDate startDate;
    private LocalDate endDate;
    private Double minAmount;
    private Double maxAmount;
    private RiskLevel riskLevel;
    private Boolean fraud;

    @Builder.Default
    private Integer page = 0;
    @Builder.Default
    private Integer size = 10;

}