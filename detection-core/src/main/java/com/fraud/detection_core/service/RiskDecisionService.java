package com.fraud.detection_core.service;

import com.fraud.detection_core.entity.RiskAction;
import com.fraud.detection_core.entity.RiskLevel;
import org.springframework.stereotype.Service;

@Service
public class RiskDecisionService {

    public RiskLevel determineRiskLevel(double score) {
        if (score >= 80) return RiskLevel.HIGH;
        if (score >= 45) return RiskLevel.MEDIUM;
        return RiskLevel.LOW;
    }

    public RiskAction determineAction(RiskLevel level, double score) {
        if (level == RiskLevel.HIGH) {
            return score >= 90 ? RiskAction.BLOCK_AND_ALERT : RiskAction.BLOCK;
        }
        
        if (level == RiskLevel.MEDIUM) {
            // In a real world app, scores between 60-80 usually trigger MFA
            if (score >= 60) return RiskAction.CHALLENGE_MFA;
            return RiskAction.REVIEW;
        }
        
        if (level == RiskLevel.LOW) {
            if (score >= 25) return RiskAction.ALLOW_WITH_FLAG;
            return RiskAction.ALLOW;
        }
        
        return RiskAction.ALLOW;
    }
}