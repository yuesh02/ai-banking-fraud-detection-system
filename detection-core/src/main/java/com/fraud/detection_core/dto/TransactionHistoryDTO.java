package com.fraud.detection_core.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TransactionHistoryDTO {

    private String transactionId;

    private Double amount;

    private String merchantId;

    private LocalDateTime timestamp;

}