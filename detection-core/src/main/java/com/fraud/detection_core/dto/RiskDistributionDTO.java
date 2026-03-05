package com.fraud.detection_core.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RiskDistributionDTO {
    private String range;
    private Long count;
    
}