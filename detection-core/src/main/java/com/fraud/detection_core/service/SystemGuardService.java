package com.fraud.detection_core.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Slf4j
@Service
public class SystemGuardService {

    // Tracks fraud blocks per merchant in the last 10 minutes
    private final Map<String, AtomicInteger> merchantFraudCounter = new ConcurrentHashMap<>();
    private final Map<String, LocalDateTime> merchantFreezeExpiry = new ConcurrentHashMap<>();
    
    private static final int FRAUD_THRESHOLD = 5; // 5 blocks triggers a freeze
    private static final int FREEZE_DURATION_MINUTES = 30;

    public boolean isMerchantFrozen(String merchantId) {
        if (merchantId == null) return false;
        
        LocalDateTime expiry = merchantFreezeExpiry.get(merchantId);
        if (expiry != null) {
            if (expiry.isAfter(LocalDateTime.now())) {
                return true;
            } else {
                // Freeze expired
                merchantFreezeExpiry.remove(merchantId);
                merchantFraudCounter.remove(merchantId);
            }
        }
        return false;
    }

    public void recordFraudBlock(String merchantId) {
        if (merchantId == null) return;

        AtomicInteger count = merchantFraudCounter.computeIfAbsent(merchantId, k -> new AtomicInteger(0));
        int currentCount = count.incrementAndGet();

        if (currentCount >= FRAUD_THRESHOLD) {
            log.warn("🚨 SYSTEM GUARD: Merchant {} exceeded fraud threshold. FREEZING for {} minutes.", 
                    merchantId, FREEZE_DURATION_MINUTES);
            merchantFreezeExpiry.put(merchantId, LocalDateTime.now().plusMinutes(FREEZE_DURATION_MINUTES));
        }
    }

    public Map<String, LocalDateTime> getActiveFreezes() {
        return merchantFreezeExpiry;
    }

    public void clearFreeze(String merchantId) {
        merchantFreezeExpiry.remove(merchantId);
        merchantFraudCounter.remove(merchantId);
    }
}
