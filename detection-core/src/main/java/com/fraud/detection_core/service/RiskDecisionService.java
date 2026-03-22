package com.fraud.detection_core.service;

import com.fraud.detection_core.entity.RiskAction;
import com.fraud.detection_core.entity.RiskLevel;
import org.springframework.stereotype.Service;

@Service
public class RiskDecisionService {

    public RiskLevel determineRiskLevel(double score) {

        if (score >= 70) {
            return RiskLevel.HIGH;
        }

        if (score >= 40) {
            return RiskLevel.MEDIUM;
        }

        return RiskLevel.LOW;
    }

    public RiskAction determineAction(RiskLevel level) {

        switch (level) {

            case HIGH:
                return RiskAction.BLOCK_AND_ALERT;

            case MEDIUM:
                return RiskAction.REVIEW;

            case LOW:
                return RiskAction.ALLOW_WITH_FLAG;

            default:
                return RiskAction.ALLOW;
        }
    }
}