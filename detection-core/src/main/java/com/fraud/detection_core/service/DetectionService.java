package com.fraud.detection_core.service;

import com.fraud.detection_core.entity.FraudRisk;
import com.fraud.detection_core.entity.RiskAction;
import com.fraud.detection_core.entity.RiskLevel;
import com.fraud.detection_core.entity.Transaction;
import com.fraud.detection_core.repository.FraudRiskRepository;
import com.fraud.detection_core.repository.TransactionRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DetectionService {

    private final RiskDecisionService riskDecisionService;
    private final TransactionRepository transactionRepository;
    private final FraudRiskRepository riskRepository;
    private final RiskEngine riskEngine;
    private final MLScoringService mlScoringService;
    private final FeatureExtractor featureExtractor;
    private final AlertService alertService;
    private final SystemGuardService systemGuard;

    public FraudRisk evaluate(Transaction transaction) {

        // 0.1 Save the transaction itself (essential for manual injection)
        transactionRepository.save(transaction);

        // 0️⃣ Check Global Kill-Switch
        if (systemGuard.isMerchantFrozen(transaction.getMerchantId())) {
            FraudRisk killSwitchRisk = FraudRisk.builder()
                    .transactionId(transaction.getTransactionId())
                    .customerId(transaction.getCustomerId())
                    .riskScore(100.0)
                    .riskLevel(RiskLevel.HIGH)
                    .action(RiskAction.BLOCK)
                    .fraud(true)
                    .reason("🚨 SYSTEM_GUARD: Merchant [" + transaction.getMerchantId() + "] is currently FROZEN due to high fraud velocity.")
                    .timestamp(LocalDateTime.now())
                    .build();
            
            riskRepository.save(killSwitchRisk);
            return killSwitchRisk;
        }

        // 1️⃣ Get transaction history
        List<Transaction> history =
                transactionRepository.findByCustomerId(
                        transaction.getCustomerId()
                );

        StringBuilder reasons = new StringBuilder();
        java.util.Map<String, Integer> breakdown = new java.util.HashMap<>();

        // 2️⃣ RULE-BASED RISK SCORE
        int ruleScore =
                riskEngine.calculateRisk(
                        transaction,
                        history,
                        reasons,
                        breakdown
                );
        
        // 3️⃣ FEATURE EXTRACTION
        FeatureDTO features =
                featureExtractor.extract(
                        transaction,
                        history
                );

        // 4️⃣ ML PROBABILITY (0–1)
        double mlProbability =
                mlScoringService.score(features);

        int mlScore = -1;
        int finalScore;

        if (mlProbability >= 0) {
            mlScore = (int) (mlProbability * 100);
            
            // 5️⃣ HYBRID SCORE with EXTREME RISK BYPASS
            if (ruleScore >= 90) {
                // If rules are extremely certain (90+), AI cannot dilute the result.
                finalScore = ruleScore;
                reasons.append("[EXTREME RISK: Auto-Block triggered by multiple rule hits]. ");
            } else {
                finalScore = (int) ((0.6 * ruleScore) + (0.4 * mlScore));
                
                // CRITICAL OVERRIDE: AI should not be able to "clear" a critical rule violation.
                String reasonText = reasons.toString();
                if (reasonText.contains("Geospatial") || reasonText.contains("Merchant") || reasonText.contains("Velocity")) {
                    if (finalScore < 50) {
                        finalScore = 50; 
                        reasons.append("[OVERRIDE: Critical rule triggered; AI score dismissed]. ");
                    }
                }
            }
        } else {
            finalScore = ruleScore;
        }

        // 6️⃣ DETERMINE RISK LEVEL
        RiskLevel level =
                riskDecisionService
                        .determineRiskLevel(finalScore);

        // 7️⃣ DETERMINE ACTION
        RiskAction action =
                riskDecisionService
                        .determineAction(level, (double) finalScore);

        boolean fraud =
                level == RiskLevel.HIGH;

        // 8️⃣ BUILD FINAL REASON SAFELY
        String finalReason;

        if (reasons.length() > 0) {
            finalReason = reasons.toString();
            if (mlScore >= 0) {
                finalReason += " ML Score: " + mlScore;
            } else {
                finalReason += " (ML Service Offline - Rules Only)";
            }
        } else {
            if (mlScore >= 0) {
                finalReason = "No rule triggered; ML Score: " + mlScore;
            } else {
                finalReason = "No rule triggered; ML Service Offline.";
            }
        }

        String analysis = breakdown.entrySet().stream()
                .map(e -> e.getKey() + ":" + e.getValue())
                .collect(java.util.stream.Collectors.joining(";"));

        // 9️⃣ CREATE FRAUD RECORD
        FraudRisk risk =
                FraudRisk.builder()
                        .transactionId(
                                transaction.getTransactionId()
                        )
                        .customerId(
                                transaction.getCustomerId()
                        )
                        .riskScore(
                                (double) finalScore
                        )
                        .actualFraud(
                            Boolean.TRUE.equals(transaction.getFraud())
                        )
                        .riskLevel(level)
                        .action(action)
                        .fraud(fraud)
                        .reason(finalReason)
                        .riskAnalysis(analysis)
                        .timestamp(
                                LocalDateTime.now()
                        )
                        .build();

        // 🔟 SAVE RESULT
        transactionRepository.save(transaction); // RESTORED: Vital for Network Analysis
        riskRepository.save(risk);

        // TRIGGER ALERT IF AUTOMATICALLY BLOCKED
        if (action == RiskAction.BLOCK || action == RiskAction.BLOCK_AND_ALERT) {
            systemGuard.recordFraudBlock(transaction.getMerchantId());
            alertService.triggerFraudAlert(risk, "Automated Detection Core");
        }

        return risk;
    }
}