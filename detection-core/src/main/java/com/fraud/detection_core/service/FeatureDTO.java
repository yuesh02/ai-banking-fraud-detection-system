package com.fraud.detection_core.service;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FeatureDTO {

    private double amount;
    private int velocity;
    private int newDevice;
    private int newCountry;
    private int highRiskMerchant;
    private double rollingAvgRatio;
    private int timeOfDay;
    private double ipRiskScore;
}