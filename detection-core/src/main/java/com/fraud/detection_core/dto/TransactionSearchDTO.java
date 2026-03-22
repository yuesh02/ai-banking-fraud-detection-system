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

    private LocalDate startDate;

    private LocalDate endDate;

    private Double minAmount;

    private Double maxAmount;

    private RiskLevel riskLevel;

    private Boolean fraud;

    private Integer page = 0;

    private Integer size = 10;

}