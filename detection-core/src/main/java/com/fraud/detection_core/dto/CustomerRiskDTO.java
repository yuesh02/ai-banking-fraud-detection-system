package com.fraud.detection_core.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CustomerRiskDTO {
    private String customerId;
    private Long fraudCount;
}