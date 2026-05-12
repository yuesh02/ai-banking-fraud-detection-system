package com.fraud.transaction_api_gateway.service.dto;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TransactionEventDTO {
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
    private Boolean fraud;
}