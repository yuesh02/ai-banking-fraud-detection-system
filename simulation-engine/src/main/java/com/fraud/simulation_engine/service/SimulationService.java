package com.fraud.simulation_engine.service;

import com.fraud.simulation_engine.model.TransactionRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class SimulationService {

    private final Random random = new Random();
    private final Map<String, String> customerDeviceMap = new HashMap<>();
    private final Map<String, Double> customerAverageAmount = new HashMap<>();

    private final List<String> customerNames = List.of(
            "Rahul Sharma", "Sarah Jenkins", "Michael Chen", "Aisha Khan", "David Miller",
            "Elena Rodriguez", "Yuki Tanaka", "John Smith", "Priya Patel", "Liam Wilson"
    );

    private final List<String> merchants = List.of(
            "Amazon.com", "Starbucks Coffee", "Apple Store", "Uber Technologies", "Netflix",
            "Walmart Supercenter", "Steam Games", "Binance Exchange", "Roobet Casino", "Zara Fashion"
    );

    private final Map<String, String> merchantCategoryMap = Map.of(
            "Amazon.com", "E-COMMERCE",
            "Starbucks Coffee", "FOOD",
            "Apple Store", "ELECTRONICS",
            "Uber Technologies", "TRAVEL",
            "Netflix", "ENTERTAINMENT",
            "Walmart Supercenter", "GROCERY",
            "Steam Games", "GAMING",
            "Binance Exchange", "CRYPTO",
            "Roobet Casino", "GAMBLING",
            "Zara Fashion", "RETAIL"
    );

    private final List<String> devices = List.of(
            "iPhone 15 Pro", "Samsung S24 Ultra", "MacBook Pro M3", "Chrome/Win11", "Pixel 8"
    );

    public TransactionRequest generateTransaction() {
        int scenario = random.nextInt(100);

        // Coordination scenarios for Network Rings and Kill-Switches
        if (scenario < 5) return generateFraudRingScenario(); // 5% chance of ring activity
        if (scenario < 8) return generateMerchantBurstScenario(); // 3% chance of burst attack
        
        String customer = randomFrom(customerNames);
        if (scenario < 60) return generateNormalTransaction(customer);
        if (scenario < 80) return generateSuspiciousTransaction(customer);
        if (scenario < 95) return generateFraudTransaction(customer);
        return generateCardTestingScenario(customer);
    }

    private TransactionRequest generateNormalTransaction(String customer) {
        String merchant = randomFrom(List.of("Amazon.com", "Starbucks Coffee", "Uber Technologies", "Netflix"));
        String device = customerDeviceMap.computeIfAbsent(customer, k -> randomFrom(devices));
        
        return baseBuilder(customer)
                .amount(20.0 + random.nextDouble() * 100)
                .merchantId(merchant)
                .merchantCategory(merchantCategoryMap.get(merchant))
                .merchantCountry("IN")
                .customerCountry("IN")
                .deviceId(device)
                .fraud(false)
                .build();
    }

    private TransactionRequest generateSuspiciousTransaction(String customer) {
        String merchant = randomFrom(List.of("Binance Exchange", "Delta Airlines"));
        return baseBuilder(customer)
                .amount(2500.0 + random.nextDouble() * 2000)
                .merchantId(merchant)
                .merchantCategory(merchantCategoryMap.getOrDefault(merchant, "TRAVEL"))
                .merchantCountry("US")
                .customerCountry("IN")
                .fraud(false)
                .build();
    }

    private TransactionRequest generateFraudTransaction(String customer) {
        String merchant = randomFrom(List.of("Binance Exchange", "Roobet Casino"));
        return baseBuilder(customer)
                .amount(9000 + random.nextDouble() * 900)
                .merchantId(merchant)
                .merchantCategory(merchantCategoryMap.get(merchant))
                .merchantCountry("NG") // High risk country
                .customerCountry("IN")
                .deviceId("HACKER-TOOL-" + UUID.randomUUID().toString().substring(0, 4))
                .timestamp(LocalDateTime.now().withHour(2)) // Night time
                .fraud(true)
                .build();
    }

    private TransactionRequest generateFraudRingScenario() {
        // Different names, same device
        String customer = randomFrom(customerNames);
        return baseBuilder(customer)
                .amount(500.0)
                .merchantId("Steam Games")
                .merchantCategory("GAMING")
                .deviceId("SHARED-FRAUD-DEVICE-99")
                .fraud(true)
                .build();
    }

    private TransactionRequest generateMerchantBurstScenario() {
        // High frequency for one specific merchant to trigger Kill-Switch
        return baseBuilder("Attack-Bot-01")
                .amount(9999.0)
                .merchantId("Roobet Casino")
                .merchantCategory("GAMBLING")
                .merchantCountry("NG")
                .fraud(true)
                .build();
    }

    private TransactionRequest generateCardTestingScenario(String customer) {
        return baseBuilder(customer)
                .amount(1.50)
                .merchantId("Small-USA-Store")
                .merchantCategory("RETAIL")
                .merchantCountry("US")
                .fraud(true)
                .build();
    }

    private TransactionRequest.TransactionRequestBuilder baseBuilder(String customer) {
        return TransactionRequest.builder()
                .transactionId(UUID.randomUUID().toString())
                .accountId("ACC-" + (1000 + random.nextInt(8000)))
                .customerId(customer)
                .transactionType("DEBIT")
                .channel("MOBILE_APP")
                .currency("USD")
                .ipAddress(randomIp())
                .timestamp(LocalDateTime.now());
    }

    private String randomIp() {
        return random.nextInt(255) + "." + random.nextInt(255) + "." + random.nextInt(255) + "." + random.nextInt(255);
    }

    private String randomFrom(List<String> list) {
        return list.get(random.nextInt(list.size()));
    }
}