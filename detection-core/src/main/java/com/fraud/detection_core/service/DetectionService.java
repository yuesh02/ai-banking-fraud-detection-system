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

    public FraudRisk evaluate(Transaction transaction) {

        // 1️⃣ Get transaction history
        List<Transaction> history =
                transactionRepository.findByCustomerId(
                        transaction.getCustomerId()
                );

        StringBuilder reasons = new StringBuilder();

        // 2️⃣ RULE-BASED RISK SCORE
        int ruleScore =
                riskEngine.calculateRisk(
                        transaction,
                        history,
                        reasons
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

        int mlScore =
                (int) (mlProbability * 100);

        // 5️⃣ HYBRID SCORE
        int finalScore =
                (int) (
                        (0.6 * ruleScore) +
                        (0.4 * mlScore)
                );

        // 6️⃣ DETERMINE RISK LEVEL
        RiskLevel level =
                riskDecisionService
                        .determineRiskLevel(finalScore);

        // 7️⃣ DETERMINE ACTION
        RiskAction action =
                riskDecisionService
                        .determineAction(level);

        boolean fraud =
                level == RiskLevel.HIGH;

        // 8️⃣ BUILD FINAL REASON SAFELY
        String finalReason;

        if (reasons.length() > 0) {

            finalReason =
                    reasons.toString()
                    + " ML Score: "
                    + mlScore;

        } else {

            finalReason =
                    "No rule triggered; ML Score: "
                    + mlScore;
        }

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
                        .riskLevel(level)
                        .action(action)
                        .fraud(fraud)
                        .reason(finalReason)
                        .timestamp(
                                LocalDateTime.now()
                        )
                        .build();

        // 🔟 SAVE RESULT
        riskRepository.save(risk);

        return risk;
    }
}