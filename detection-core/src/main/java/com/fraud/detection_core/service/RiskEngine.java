package com.fraud.detection_core.service;

import com.fraud.detection_core.entity.Transaction;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Component
public class RiskEngine {

    private static final Set<String> RISKY_IPS = Set.of("45.23.1.5", "103.45.2.1", "192.168.1.200");
    private static final Set<String> RISKY_MERCHANTS = Set.of("Binance Exchange", "Roobet Casino", "M-99999");
    private static final Set<String> RISKY_COUNTRIES = Set.of("RU", "NG", "KP", "SY");

    public int calculateRisk(Transaction current,
                             List<Transaction> history,
                             StringBuilder reasons,
                             Map<String, Integer> breakdown) {

        int risk = 10;
        breakdown.put("Baseline", 10);
        
        if (history == null) return risk;

        // 1. IDENTITY & DEVICE
        if (current.getDeviceId() != null) {
            boolean knownDevice = history.stream()
                    .anyMatch(t -> current.getDeviceId().equals(t.getDeviceId()));
            if (!knownDevice) {
                risk += 25;
                reasons.append("Unrecognized Device: Transaction initiated from hardware [").append(current.getDeviceId())
                       .append("] which is not linked to this account's history. ");
                breakdown.put("Identity", breakdown.getOrDefault("Identity", 0) + 25);
            }
        }

        if (current.getIpAddress() != null && (RISKY_IPS.contains(current.getIpAddress()) || current.getIpAddress().startsWith("45."))) {
            risk += 50;
            reasons.append("Network Anomaly: IP [").append(current.getIpAddress())
                   .append("] is flagged for high reputation risk or proxy usage. ");
            breakdown.put("Network", breakdown.getOrDefault("Network", 0) + 50);
        }

        // 2. GEOSPATIAL & COUNTRY REPUTATION
        if (current.getMerchantCountry() != null && RISKY_COUNTRIES.contains(current.getMerchantCountry())) {
            risk += 40;
            reasons.append("High-Risk Region: Connection originating from [").append(current.getMerchantCountry())
                   .append("], currently on the global financial watch list. ");
            breakdown.put("Location", breakdown.getOrDefault("Location", 0) + 40);
        }

        if (!history.isEmpty() && current.getTimestamp() != null) {
            Transaction lastTxn = history.stream()
                    .filter(t -> t.getTimestamp() != null && t.getTimestamp().isBefore(current.getTimestamp()))
                    .max((t1, t2) -> t1.getTimestamp().compareTo(t2.getTimestamp()))
                    .orElse(null);

            if (lastTxn != null && lastTxn.getMerchantCountry() != null && current.getMerchantCountry() != null &&
                    !lastTxn.getMerchantCountry().equals(current.getMerchantCountry())) {
                
                long minutesDiff = ChronoUnit.MINUTES.between(lastTxn.getTimestamp(), current.getTimestamp());
                if (minutesDiff < 180) {
                    risk += 65;
                    reasons.append("Geospatial Inconsistency: Activity in [").append(current.getMerchantCountry())
                           .append("] occurred only ").append(minutesDiff)
                           .append(" mins after a transaction in [").append(lastTxn.getMerchantCountry())
                           .append("], exceeding physical travel capabilities. ");
                    breakdown.put("Location", breakdown.getOrDefault("Location", 0) + 65);
                }
            }
        }

        // 3. AMOUNT & VELOCITY
        double currentAmount = current.getAmount() != null ? current.getAmount() : 0;
        double avgAmount = history.stream().mapToDouble(Transaction::getAmount).average().orElse(currentAmount);
        if (currentAmount > avgAmount * 5 && currentAmount > 1000) {
            risk += 40;
            double ratio = Math.round((currentAmount / avgAmount) * 10) / 10.0;
            reasons.append("Spending Volatility: Transaction amount ($").append(currentAmount)
                   .append(") is ").append(ratio)
                   .append("x higher than account average ($").append(Math.round(avgAmount))
                   .append("). ");
            breakdown.put("Behavior", breakdown.getOrDefault("Behavior", 0) + 40);
        }

        long shortWindowCount = history.stream()
                .filter(t -> t.getTimestamp() != null && t.getTimestamp().isAfter(current.getTimestamp().minusSeconds(60)))
                .count();
        if (shortWindowCount >= 3) {
            risk += 40;
            reasons.append("Velocity Alert: Rapid succession of [").append(shortWindowCount + 1)
                   .append("] transactions detected within a 60-second window, indicative of automated hit. ");
            breakdown.put("Behavior", breakdown.getOrDefault("Behavior", 0) + 40);
        }

        // 4. TEMPORAL
        int hour = current.getTimestamp() != null ? current.getTimestamp().getHour() : LocalDateTime.now().getHour();
        if (hour >= 1 && hour <= 4) {
            risk += 15;
            reasons.append("Temporal Anomaly: Transaction occurred during late-night hours (").append(hour)
                   .append(":00), which correlates with high-risk behavioral clusters. ");
            breakdown.put("Temporal", breakdown.getOrDefault("Temporal", 0) + 15);
        }

        // 5. MERCHANT
        if (current.getMerchantId() != null && (RISKY_MERCHANTS.contains(current.getMerchantId()) || current.getMerchantId().contains("Casino"))) {
            risk += 75;
            reasons.append("Merchant Reputation: Destination [").append(current.getMerchantId())
                   .append("] is currently flagged on a global risk watchlist. ");
            breakdown.put("Merchant", breakdown.getOrDefault("Merchant", 0) + 75);
        }

        return Math.min(100, risk);
    }
}