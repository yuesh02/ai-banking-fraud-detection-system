package com.fraud.detection_core.service;

import com.fraud.detection_core.entity.FraudRisk;
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

    private final TransactionRepository transactionRepository;
    private final FraudRiskRepository riskRepository;
    private final RiskEngine riskEngine;
    private final MLScoringService mlScoringService;
private final FeatureExtractor featureExtractor;
    public FraudRisk evaluate(Transaction transaction) {

    // Save transaction
    //transactionRepository.save(transaction);

    // Get history
    List<Transaction> history =
            transactionRepository.findByCustomerId(transaction.getCustomerId());

    StringBuilder reasons = new StringBuilder();

    // RULE SCORE
    int ruleScore = riskEngine.calculateRisk(transaction, history, reasons);

    // FEATURE EXTRACTION
    FeatureDTO features =
            featureExtractor.extract(transaction, history);

    // ML SCORE (Probability 0–1)
    double mlProbability =
            mlScoringService.score(features);

    int mlScore = (int) (mlProbability * 100);

    // HYBRID COMBINATION
    int finalScore =
            (int) ((0.6 * ruleScore) + (0.4 * mlScore));

    boolean fraud = finalScore >= 75;

    FraudRisk risk = FraudRisk.builder()
            .transactionId(transaction.getTransactionId())
            .customerId(transaction.getCustomerId())
            .riskScore(finalScore)
            .fraud(fraud)
            .reasons(reasons.toString() + " ML:" + mlScore)
            .evaluatedAt(LocalDateTime.now())
            .build();

    riskRepository.save(risk);

    return risk;
}
}