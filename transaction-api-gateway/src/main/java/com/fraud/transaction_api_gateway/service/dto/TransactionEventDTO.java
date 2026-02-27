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
    private String customerId;
    private Double amount;
    private String deviceId;
    private String ipAddress;
    private String merchantCountry;
    private String merchantCategory;
    private LocalDateTime timestamp;
}