package com.fraud.simulation_engine.service;

import com.fraud.simulation_engine.model.TransactionRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class SimulationService {

    private final Random random = new Random();

    // Simulated customer profiles
    private final Map<String, String> customerDeviceMap = new HashMap<>();
    private final List<String> safeCountries = List.of("IN", "SG", "AE");
    private final List<String> riskyCountries = List.of("RU", "NG", "PK");
    private final List<String> normalCategories = List.of("GROCERY", "FOOD", "RETAIL", "TRAVEL");
    private final List<String> riskyCategories = List.of("CRYPTO", "GAMBLING");
    private final List<String> customers = List.of(
        "CUST100", "CUST200", "CUST300", "CUST400", "CUST500"
);
    public TransactionRequest generateTransaction() {

        String customerId = randomFrom(customers);

        // Decide behavior type
        int scenario = random.nextInt(100);

        if (scenario < 70) {
            return generateNormalTransaction(customerId);
        } else if (scenario < 90) {
            return generateSuspiciousTransaction(customerId);
        } else {
            return generateFraudTransaction(customerId);
        }
    }

    private TransactionRequest generateNormalTransaction(String customerId) {

        String device = customerDeviceMap.computeIfAbsent(
                customerId,
                k -> "DEVICE" + random.nextInt(50)
        );

        return baseBuilder(customerId)
                .amount(100 + random.nextDouble() * 5000)
                .merchantCategory(randomFrom(normalCategories))
                .merchantCountry("IN")
                .customerCountry("IN")
                .deviceId(device)
                .build();
    }

    private TransactionRequest generateSuspiciousTransaction(String customerId) {

        boolean newDevice = random.nextBoolean();

        String device = newDevice
                ? "DEVICE" + UUID.randomUUID()
                : customerDeviceMap.computeIfAbsent(customerId,
                        k -> "DEVICE" + random.nextInt(50));

        return baseBuilder(customerId)
                .amount(20000 + random.nextDouble() * 50000)
                .merchantCategory(randomFrom(normalCategories))
                .merchantCountry(randomFrom(safeCountries))
                .customerCountry("IN")
                .deviceId(device)
                .build();
    }

    private TransactionRequest generateFraudTransaction(String customerId) {

        return baseBuilder(customerId)
                .amount(100000 + random.nextDouble() * 200000)
                .merchantCategory(randomFrom(riskyCategories))
                .merchantCountry(randomFrom(riskyCountries))
                .customerCountry("IN")
                .deviceId("DEVICE" + UUID.randomUUID())
                .build();
    }

    private TransactionRequest.TransactionRequestBuilder baseBuilder(String customerId) {
        return TransactionRequest.builder()
                .transactionId(UUID.randomUUID().toString())
                .accountId("ACC" + random.nextInt(500))
                .customerId(customerId)
                .transactionType("DEBIT")
                .channel("MOBILE_APP")
                .currency("INR")
                .merchantId("M" + random.nextInt(300))
                .ipAddress("192.168.1." + random.nextInt(255))
                .timestamp(LocalDateTime.now());
    }

    private String randomFrom(List<String> list) {
        return list.get(random.nextInt(list.size()));
    }
}