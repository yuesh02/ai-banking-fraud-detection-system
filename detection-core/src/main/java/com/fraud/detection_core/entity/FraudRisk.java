package com.fraud.detection_core.entity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "fraud_risk")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Data
public class FraudRisk {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    
    private String transactionId;
    private String customerId;

    private double riskScore;
    private boolean fraud;

    @Column(nullable = false,length = 500)
    private String reason;

    @Column(nullable = false)
    private LocalDateTime timestamp;
    @Enumerated(EnumType.STRING)
    private RiskLevel riskLevel;   // LOW / MEDIUM / HIGH
    @Enumerated(EnumType.STRING)
    private RiskAction action;      // ALLOW / BLOCK / REVIEW / ALERT
   
    @Column(nullable = false)
    private Boolean actualFraud; // optional for ML metrics
@PrePersist
public void prePersist() {

    if (timestamp == null) {
        timestamp = LocalDateTime.now();
    }

    if (reason == null || reason.isBlank()) {
        reason = "Low risk behaviour detected";
    }

    if (actualFraud == null) {
        actualFraud = false;
    }
}

}