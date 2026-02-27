package com.fraud.detection_core.service;

import com.fraud.detection_core.entity.Transaction;
import com.fraud.detection_core.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FeatureExtractor {

    private final TransactionRepository repository;

    public FeatureDTO extract(Transaction current, List<Transaction> history) {

        double avgAmount = history.stream()
                .mapToDouble(Transaction::getAmount)
                .average()
                .orElse(1.0);

        double rollingRatio = current.getAmount() / avgAmount;

        long velocity = history.stream()
                .filter(t -> t.getTimestamp()
                        .isAfter(current.getTimestamp().minusSeconds(30)))
                .count();

        boolean newDevice = history.stream()
                .noneMatch(t -> t.getDeviceId()
                        .equals(current.getDeviceId()));

        boolean newCountry = history.stream()
                .noneMatch(t -> t.getMerchantCountry()
                        .equals(current.getMerchantCountry()));

        boolean highRiskMerchant =
                current.getMerchantCategory().equals("CRYPTO")
                || current.getMerchantCategory().equals("GAMBLING");

        double ipRiskScore =
                current.getIpAddress().startsWith("192.") ? 0.1 : 0.7;

        return FeatureDTO.builder()
                .amount(current.getAmount())
                .velocity((int) velocity)
                .newDevice(newDevice ? 1 : 0)
                .newCountry(newCountry ? 1 : 0)
                .highRiskMerchant(highRiskMerchant ? 1 : 0)
                .rollingAvgRatio(rollingRatio)
                .timeOfDay(current.getTimestamp().getHour())
                .ipRiskScore(ipRiskScore)
                .build();
    }
}