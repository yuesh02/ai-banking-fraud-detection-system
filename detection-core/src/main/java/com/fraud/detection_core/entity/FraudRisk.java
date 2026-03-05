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
public class FraudRisk {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    
    private String transactionId;
    private String customerId;

    private int riskScore;
    private boolean fraud;

    @Column(length = 500)
    private String reasons;

    private LocalDateTime evaluatedAt;
}