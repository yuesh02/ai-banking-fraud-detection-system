package com.fraud.detection_core.service;

import com.fraud.detection_core.entity.Transaction;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class RiskEngine {

    public int calculateRisk(Transaction current,
                             List<Transaction> history,
                             StringBuilder reasons) {

        int risk = 10; // baseline risk

        if (history == null || history.isEmpty()) {
            return risk;
        }

        // =========================
        // 1️⃣ Device Check (NULL SAFE)
        // =========================
        if (current.getDeviceId() != null) {
            boolean knownDevice = history.stream()
                    .anyMatch(t ->
                            t.getDeviceId() != null &&
                            t.getDeviceId().equals(current.getDeviceId())
                    );

            if (!knownDevice) {
                risk += 20;
                reasons.append("New device; ");
            }
        }

        // =========================
        // 2️⃣ Country Check (NULL SAFE)
        // =========================
        if (current.getMerchantCountry() != null) {
            boolean knownCountry = history.stream()
                    .anyMatch(t ->
                            t.getMerchantCountry() != null &&
                            t.getMerchantCountry().equals(current.getMerchantCountry())
                    );

            if (!knownCountry) {
                risk += 20;
                reasons.append("New country; ");
            }
        }

        // =========================
        // 3️⃣ Customer Country Mismatch
        // =========================
        if (current.getCustomerCountry() != null &&
            current.getMerchantCountry() != null &&
            !current.getCustomerCountry().equals(current.getMerchantCountry())) {

            risk += 15;
            reasons.append("Cross-border transaction; ");
        }

        // =========================
        // 4️⃣ Rolling Average
        // =========================
        double avgAmount = history.stream()
                .mapToDouble(Transaction::getAmount)
                .average()
                .orElse(0);

        if (avgAmount > 0 && current.getAmount() > avgAmount * 3) {
            risk += 25;
            reasons.append("Amount spike; ");
        }

        // =========================
        // 5️⃣ Velocity Fraud
        // =========================
        if (current.getTimestamp() != null) {

            LocalDateTime now = current.getTimestamp();

            long recentCount = history.stream()
                    .filter(t ->
                            t.getTimestamp() != null &&
                            t.getTimestamp().isAfter(now.minusSeconds(30))
                    )
                    .count();

            if (recentCount >= 5) {
                risk += 30;
                reasons.append("High velocity; ");
            }
        }

        // =========================
        // 6️⃣ High Risk Categories
        // =========================
        if (current.getMerchantCategory() != null) {
            if (current.getMerchantCategory().equalsIgnoreCase("CRYPTO") ||
                current.getMerchantCategory().equalsIgnoreCase("GAMBLING")) {

                risk += 20;
                reasons.append("High-risk merchant; ");
            }
        }

        return risk;
    }
}