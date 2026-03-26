package com.fraud.transaction_api_gateway.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "fraud")
    private Boolean fraud;
    @Column(unique = true)
    private String transactionId;

    private String accountId;
    private String customerId;
    private String transactionType;
    private String channel;
    private Double amount;
    private String currency;
    private String merchantId;
    private String merchantCategory;
    private String merchantCountry;
    private String customerCountry;
    private String deviceId;
    private String ipAddress;
    private LocalDateTime timestamp;
}