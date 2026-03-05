package com.fraud.detection_core.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FraudVsLegitDTO {
    private Long fraud;
    private Long legit;
}