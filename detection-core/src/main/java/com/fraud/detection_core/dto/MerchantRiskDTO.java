package com.fraud.detection_core.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class MerchantRiskDTO {

    private String merchantId;
    private Long fraudCount;
}