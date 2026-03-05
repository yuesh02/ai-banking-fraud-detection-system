package com.fraud.detection_core.service;

import com.fraud.detection_core.dto.CountryRiskDTO;
import com.fraud.detection_core.dto.DashboardSummaryDTO;
import com.fraud.detection_core.dto.FraudTrendDTO;
import com.fraud.detection_core.dto.MerchantRiskDTO;
import com.fraud.detection_core.repository.FraudRiskRepository;
import com.fraud.detection_core.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final FraudRiskRepository fraudRiskRepository;
    private final TransactionRepository transactionRepository;

    public DashboardSummaryDTO getSummary() {

        Long totalTransactions = fraudRiskRepository.countTotalTransactions();
        Long totalFrauds = fraudRiskRepository.countTotalFrauds();
        Double avgRisk = fraudRiskRepository.averageRiskScore();
        Double totalAmount = transactionRepository.totalTransactionAmount();

        double fraudRate = 0.0;
        if (totalTransactions != 0) {
            fraudRate = (double) totalFrauds / totalTransactions * 100;
        }

        return new DashboardSummaryDTO(
                totalTransactions,
                totalFrauds,
                fraudRate,
                totalAmount,
                avgRisk
        );
    }

    public List<FraudTrendDTO> getFraudTrend() {

        return fraudRiskRepository.fraudTrend()
                .stream()
                .map(obj -> new FraudTrendDTO(
                        obj[0].toString(),
                        (Long) obj[1]
                ))
                .collect(Collectors.toList());
    }

    public List<MerchantRiskDTO> getTopRiskyMerchants() {

        return fraudRiskRepository.topRiskyMerchants()
                .stream()
                .map(obj -> new MerchantRiskDTO(
                        obj[0].toString(),
                        (Long) obj[1]
                ))
                .collect(Collectors.toList());
    }

    public List<CountryRiskDTO> getRiskByCountry() {

        return transactionRepository.fraudByCountry()
                .stream()
                .map(obj -> new CountryRiskDTO(
                        obj[0].toString(),
                        (Long) obj[1]
                ))
                .collect(Collectors.toList());
    }
    
}