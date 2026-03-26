package com.fraud.simulation_engine.service;

import com.fraud.simulation_engine.model.TransactionRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class SimulationService {

    private final Random random = new Random();

    // Device tracking
    private final Map<String, String> customerDeviceMap =
            new HashMap<>();

    // Spending profile tracking
    private final Map<String, Double> customerAverageAmount =
            new HashMap<>();

    // Merchant familiarity tracking
    private final Map<String, String> customerMerchantMap =
            new HashMap<>();

    private final List<String> safeCountries =
            List.of("IN", "SG", "AE");

    private final List<String> riskyCountries =
            List.of("RU", "NG", "PK");

    private final List<String> normalCategories =
            List.of(
                    "GROCERY",
                    "FOOD",
                    "RETAIL",
                    "TRAVEL"
            );

    private final List<String> riskyCategories =
            List.of(
                    "CRYPTO",
                    "GAMBLING"
            );

    private final List<String> customers =
            List.of(
                    "CUST100",
                    "CUST200",
                    "CUST300",
                    "CUST400",
                    "CUST500"
            );

    public TransactionRequest generateTransaction() {

        String customerId =
                randomFrom(customers);

        int scenario =
                random.nextInt(100);

        if (scenario < 70)
            return generateNormalTransaction(
                    customerId
            );

        else if (scenario < 90)
            return generateSuspiciousTransaction(
                    customerId
            );

        else
            return generateFraudTransaction(
                    customerId
            );
    }

    // NORMAL

    private TransactionRequest generateNormalTransaction(
            String customerId
    ) {

        String device =
                customerDeviceMap
                        .computeIfAbsent(
                                customerId,
                                k -> "DEVICE"
                                        + random.nextInt(50)
                        );

        String merchant =
                customerMerchantMap
                        .computeIfAbsent(
                                customerId,
                                k -> "M"
                                        + random.nextInt(50)
                        );

        double avg =
                customerAverageAmount
                        .getOrDefault(
                                customerId,
                                1000.0
                        );

        double amount =
                avg
                        * (
                        0.5
                                + random.nextDouble()
                );

        customerAverageAmount.put(
                customerId,
                amount
        );

        return baseBuilder(customerId)
                .amount(amount)
                .merchantCategory(
                        randomFrom(
                                normalCategories
                        )
                )
                .merchantCountry("IN")
                .customerCountry("IN")
                .deviceId(device)
                .merchantId(merchant)
                .fraud(false)
                .build();
    }

    // SUSPICIOUS

    private TransactionRequest generateSuspiciousTransaction(
            String customerId
    ) {

        boolean newDevice =
                random.nextBoolean();

        String device =
                newDevice
                        ? "DEVICE"
                        + UUID.randomUUID()
                        : customerDeviceMap
                        .computeIfAbsent(
                                customerId,
                                k -> "DEVICE"
                                        + random.nextInt(50)
                        );

        double avg =
                customerAverageAmount
                        .getOrDefault(
                                customerId,
                                1000.0
                        );

        double amount =
                avg
                        * (
                        2
                                + random.nextDouble()
                        * 2
                );

        return baseBuilder(customerId)
                .amount(amount)
                .merchantCategory(
                        randomFrom(
                                normalCategories
                        )
                )
                .merchantCountry(
                        randomFrom(
                                safeCountries
                        )
                )
                .customerCountry("IN")
                .deviceId(device)
                .fraud(false)
                .build();
    }

    // FRAUD

    private TransactionRequest generateFraudTransaction(
            String customerId
    ) {

        double avg =
                customerAverageAmount
                        .getOrDefault(
                                customerId,
                                1000.0
                        );

        double amount =
                avg
                        * (
                        3
                                + random.nextDouble()
                        * 5
                );

        LocalDateTime now =
                LocalDateTime.now();

        if (random.nextDouble() < 0.2) {

            now =
                    now.withHour(
                            2
                                    + random.nextInt(4)
                    );
        }

        return baseBuilder(customerId)
                .amount(amount)
                .merchantCategory(
                        randomFrom(
                                riskyCategories
                        )
                )
                .merchantCountry(
                        randomFrom(
                                riskyCountries
                        )
                )
                .customerCountry("IN")
                .deviceId(
                        "DEVICE"
                                + UUID.randomUUID()
                )
                .timestamp(now)
                .fraud(true)
                .build();
    }

    private TransactionRequest.TransactionRequestBuilder
    baseBuilder(String customerId) {

        return TransactionRequest
                .builder()

                .transactionId(
                        UUID.randomUUID()
                                .toString()
                )

                .accountId(
                        "ACC"
                                + random.nextInt(500)
                )

                .customerId(customerId)

                .transactionType("DEBIT")

                .channel("MOBILE_APP")

                .currency("INR")

                .merchantId(
                        "M"
                                + random.nextInt(300)
                )

                .ipAddress(
                        "192.168.1."
                                + random.nextInt(255)
                )

                .timestamp(
                        LocalDateTime.now()
                );
    }

    private String randomFrom(
            List<String> list
    ) {
        return list.get(
                random.nextInt(
                        list.size()
                )
        );
    }
}