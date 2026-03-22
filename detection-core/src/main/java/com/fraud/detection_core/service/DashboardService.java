package com.fraud.detection_core.service;

import com.fraud.detection_core.dto.*;
import com.fraud.detection_core.entity.FraudRisk;
import com.fraud.detection_core.entity.RiskLevel;
import com.fraud.detection_core.entity.Transaction;
import com.fraud.detection_core.repository.FraudRiskRepository;
import com.fraud.detection_core.repository.TransactionRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final FraudRiskRepository fraudRiskRepository;
    private final TransactionRepository transactionRepository;


public List<TransactionMonitorDTO> getLiveTransactions() {

    List<FraudRisk> risks =
            fraudRiskRepository.findRecentTransactions(
                    PageRequest.of(0, 20)
            );

    return risks.stream()
            .map(r -> {

                Transaction txn =
                        transactionRepository
                                .findByTransactionId(
                                        r.getTransactionId()
                                )
                                .orElse(null);

                return TransactionMonitorDTO.builder()

                        .transactionId(
                                r.getTransactionId()
                        )

                        .customerId(
                                r.getCustomerId()
                        )

                        .amount(
                                txn != null
                                        ? txn.getAmount()
                                        : null
                        )

                        .riskScore(
                                r.getRiskScore()
                        )

                        .riskLevel(
                                r.getRiskLevel()
                        )

                        .action(
                                r.getAction()
                        )

                        .fraud(
                                r.isFraud()
                        )

                        .reason(
                                r.getReason()
                        )

                        .timestamp(
                                r.getTimestamp()
                        )

                        .build();

            })
            .toList();
}
    // ================= SUMMARY =================

    public DashboardSummaryDTO getSummary() {

        Long totalTransactions = fraudRiskRepository.countTotalTransactions();
        Long totalFrauds = fraudRiskRepository.countTotalFrauds();
        Double avgRisk = fraudRiskRepository.averageRiskScore();
        Double totalAmount = transactionRepository.totalTransactionAmount();

        double fraudRate = 0.0;

        if (totalTransactions != null && totalTransactions > 0) {
            fraudRate =
                    (double) totalFrauds / totalTransactions * 100;
        }

        return new DashboardSummaryDTO(
                totalTransactions,
                totalFrauds,
                fraudRate,
                totalAmount,
                avgRisk
        );
    }

    // ================= FRAUD TREND =================

    public List<FraudTrendDTO> getFraudTrend() {

        return fraudRiskRepository.fraudTrend()
                .stream()
                .filter(obj -> obj[0] != null && obj[1] != null)
                .map(obj -> new FraudTrendDTO(
                        obj[0].toString(),
                        ((Number) obj[1]).longValue()
                ))
                .collect(Collectors.toList());
    }

    // ================= TOP MERCHANTS =================

    public List<MerchantRiskDTO> getTopRiskyMerchants() {

        return fraudRiskRepository.topRiskyMerchants()
                .stream()
                .filter(obj -> obj[0] != null && obj[1] != null)
                .map(obj -> new MerchantRiskDTO(
                        obj[0].toString(),
                        ((Number) obj[1]).longValue()
                ))
                .collect(Collectors.toList());
    }

    public TransactionDetailResponseDTO getTransactionDetails(
        String transactionId
) {

    Transaction txn =
            transactionRepository
                    .findByTransactionId(transactionId)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Transaction not found"
                            )
                    );

    FraudRisk risk =
            fraudRiskRepository
                    .findByTransactionId(transactionId)
                    .orElse(null);

    List<Transaction> historyList =
            transactionRepository
                    .findByCustomerIdOrderByTimestampDesc(
                            txn.getCustomerId()
                    );

    List<TransactionHistoryDTO> history =
            historyList.stream()
                    .limit(10)
                    .map(t ->
                            TransactionHistoryDTO.builder()
                                    .transactionId(
                                            t.getTransactionId()
                                    )
                                    .amount(
                                            t.getAmount()
                                    )
                                    .merchantId(
                                            t.getMerchantId()
                                    )
                                    .timestamp(
                                            t.getTimestamp()
                                    )
                                    .build()
                    )
                    .toList();

    return TransactionDetailResponseDTO.builder()

            .transactionId(
                    txn.getTransactionId()
            )

            .customerId(
                    txn.getCustomerId()
            )

            .amount(
                    txn.getAmount()
            )

            .merchantId(
                    txn.getMerchantId()
            )

            .merchantCountry(
                    txn.getMerchantCountry()
            )

            .deviceId(
                    txn.getDeviceId()
            )

            .riskScore(
                    risk != null
                            ? risk.getRiskScore()
                            : null
            )

            .riskLevel(
                    risk != null
                            ? risk.getRiskLevel()
                            : null
            )

            .action(
                    risk != null
                            ? risk.getAction()
                            : null
            )

            .fraud(
                    risk != null
                            ? risk.isFraud()
                            : false
            )

            .reason(
                    risk != null
                            ? risk.getReason()
                            : "SAFE"
            )

            .timestamp(
                    txn.getTimestamp()
            )

            .history(history)

            .build();
}

public Page<Object> searchTransactions(
        TransactionSearchDTO search
) {

    Page<FraudRisk> risks =
            fraudRiskRepository.searchTransactions(
                    search.getRiskLevel(),
                    search.getFraud(),
                    search.getStartDate() != null
                            ? search.getStartDate().atStartOfDay()
                            : null,
                    search.getEndDate() != null
                            ? search.getEndDate().atTime(23,59,59)
                            : null,
                    PageRequest.of(
                            search.getPage(),
                            search.getSize()
                    )
            );

    return risks.map(r -> {

        Transaction txn =
                transactionRepository
                        .findByTransactionId(
                                r.getTransactionId()
                        )
                        .orElse(null);

        if (txn == null)
            return null;

        return mapToTransactionDetails(
                r,
                txn
        );

    });
}
private TransactionDetailsDTO mapToTransactionDetails(
        FraudRisk risk,
        Transaction txn
) {

    return TransactionDetailsDTO.builder()

            .transactionId(
                    risk.getTransactionId()
            )

            .customerId(
                    risk.getCustomerId()
            )
            .amount(
                    txn.getAmount()
            )

            .merchantId(
                    txn.getMerchantId()
            )

            .merchantCountry(
                    txn.getMerchantCountry()
            )

            .deviceId(
                    txn.getDeviceId()
            )

            .riskScore(
                    risk.getRiskScore()
            )

            .riskLevel(
                    risk.getRiskLevel()
            )

            .action(
                    risk.getAction()
            )

            .fraud(
                    risk.isFraud()
            )

            .reason(
                    risk.getReason()
            )

            .timestamp(
                    risk.getTimestamp()
            )

            .build();
}
    // ================= COUNTRY RISK =================

    public List<CountryRiskDTO> getRiskByCountry() {

        return transactionRepository.fraudByCountry()
                .stream()
                .filter(obj -> obj[0] != null && obj[1] != null)
                .map(obj -> new CountryRiskDTO(
                        obj[0].toString(),
                        ((Number) obj[1]).longValue()
                ))
                .collect(Collectors.toList());
    }

    // ================= METRICS =================

    public MetricsDTO getMetrics() {

        List<FraudRisk> data = fraudRiskRepository.findAll();

        int TP = 0, FP = 0, FN = 0, TN = 0;

        for (FraudRisk f : data) {

            boolean predicted = Boolean.TRUE.equals(f.isFraud());
            boolean actual = Boolean.TRUE.equals(f.getActualFraud());

            if (predicted && actual)
                TP++;

            else if (predicted)
                FP++;

            else if (actual)
                FN++;

            else
                TN++;
        }

        MetricsDTO dto = new MetricsDTO();

        int total = data.size();

        if (total > 0) {

            dto.setAccuracy(
                    ((TP + TN) * 100.0) / total
            );

            dto.setPrecision(
                    (TP + FP) == 0 ? 0 :
                            (TP * 100.0) / (TP + FP)
            );

            dto.setRecall(
                    (TP + FN) == 0 ? 0 :
                            (TP * 100.0) / (TP + FN)
            );
        }

        dto.setTruePositive(TP);
        dto.setFalsePositive(FP);
        dto.setFalseNegative(FN);
        dto.setTrueNegative(TN);

        return dto;
    }
public Page<TransactionDetailsDTO> getRecentTransactions() {

        Page<Transaction> transactions =
                transactionRepository
                        .findAllByOrderByTimestampDesc(
                                PageRequest.of(0, 10)
                        );

        return transactions.map(txn -> {

            FraudRisk risk =
                    fraudRiskRepository
                            .findTopByTransactionIdOrderByTimestampDesc(
                                    txn.getTransactionId()
                            );

            if (risk == null)
                return null;

            return mapToTransactionDetails(
                    risk,
                    txn
            );

        });

    }
    // ================= RISK DISTRIBUTION =================

    public List<RiskDistributionDTO> getRiskDistribution() {

        List<FraudRisk> list =
                fraudRiskRepository.findAll();

        long low =
                list.stream()
                        .filter(f ->
                                f.getRiskLevel()
                                        == RiskLevel.LOW)
                        .count();

        long med =
                list.stream()
                        .filter(f ->
                                f.getRiskLevel()
                                        == RiskLevel.MEDIUM)
                        .count();

        long high =
                list.stream()
                        .filter(f ->
                                f.getRiskLevel()
                                        == RiskLevel.HIGH)
                        .count();

        return List.of(
                new RiskDistributionDTO(
                        "LOW",
                        (int) low
                ),
                new RiskDistributionDTO(
                        "MEDIUM",
                        (int) med
                ),
                new RiskDistributionDTO(
                        "HIGH",
                        (int) high
                )
        );
    }

    // ================= ALERTS =================

    public List<FraudRisk> getAlerts() {

        return fraudRiskRepository
                .findByRiskLevelOrderByTimestampDesc(
                        RiskLevel.HIGH,
                        PageRequest.of(0, 10)
                )
                .getContent();
    }

    // ================= TRANSACTIONS =================

    public Page<FraudRisk> getTransactions(
            int page,
            int size
    ) {

        return fraudRiskRepository.findAll(
                PageRequest.of(page, size)
        );
    }

    // ================= FILTER BY RISK LEVEL =================

    public Page<FraudRisk> getTransactionsByRiskLevel(
            String riskLevel,
            int page,
            int size
    ) {

        RiskLevel level =
                RiskLevel.valueOf(
                        riskLevel.toUpperCase()
                );

        return fraudRiskRepository
                .findByRiskLevelOrderByTimestampDesc(
                        level,
                        PageRequest.of(page, size)
                );
    }

}