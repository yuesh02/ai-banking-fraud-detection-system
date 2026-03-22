package com.fraud.detection_core.dto;

import lombok.Data;

@Data
public class MetricsDTO {

    private double accuracy;
    private double precision;
    private double recall;

    private int truePositive;
    private int falsePositive;
    private int falseNegative;
    private int trueNegative;
}