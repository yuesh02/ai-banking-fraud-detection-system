package com.fraud.detection_core.service;

import com.fraud.detection_core.entity.FraudRisk;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class AlertService {

    public void triggerFraudAlert(FraudRisk risk, String triggerType) {
        // In a real system, this would call Twilio/SendGrid APIs.
        // For the prototype, we simulate a highly visible alert in the logs.
        
        System.out.println("\n");
        System.out.println("=========================================================");
        System.out.println("🚨 MOCK EMAIL ALERT: FRAUD BLOCKED 🚨");
        System.out.println("=========================================================");
        System.out.println("To: fraud-team@bank.com");
        System.out.println("Subject: Urgent: Fraudulent Transaction Blocked (" + risk.getTransactionId() + ")");
        System.out.println("Trigger: " + triggerType);
        System.out.println("");
        System.out.println("Details:");
        System.out.println("  - Customer ID: " + risk.getCustomerId());
        System.out.println("  - Risk Score: " + risk.getRiskScore());
        System.out.println("  - System Reason: " + risk.getReason());
        System.out.println("=========================================================");
        System.out.println("\n");
        
        log.warn("Alert generated for transaction {}", risk.getTransactionId());
    }
}
