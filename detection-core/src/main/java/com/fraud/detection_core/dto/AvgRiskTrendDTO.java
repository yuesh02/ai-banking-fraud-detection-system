package com.fraud.detection_core.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class AvgRiskTrendDTO {
    private LocalDate date;
    private Double avgRisk;
}