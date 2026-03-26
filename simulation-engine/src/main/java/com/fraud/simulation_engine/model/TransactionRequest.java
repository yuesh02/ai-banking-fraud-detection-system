package com.fraud.simulation_engine.model;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransactionRequest {

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

    // NEW — Ground truth label
    private Boolean fraud;
}