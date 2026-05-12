package com.fraud.transaction_api_gateway.service;

import com.fraud.transaction_api_gateway.entity.Transaction;
import com.fraud.transaction_api_gateway.service.dto.TransactionEventDTO;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class DetectionClient {

    private final RestTemplate restTemplate;

    @org.springframework.beans.factory.annotation.Value("${detection.core.url:http://localhost:8082/detect}")
    private String detectionCoreUrl;

    public DetectionClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public void forward(Transaction txn) {

        String url = detectionCoreUrl;

        // Map Entity → DTO for Detection Core
        TransactionEventDTO dto = TransactionEventDTO.builder()
                .transactionId(txn.getTransactionId())
                .accountId(txn.getAccountId())
                .customerId(txn.getCustomerId())
                .transactionType(txn.getTransactionType())
                .channel(txn.getChannel())
                .amount(txn.getAmount())
                .currency(txn.getCurrency())
                .merchantId(txn.getMerchantId())
                .merchantCategory(txn.getMerchantCategory())
                .merchantCountry(txn.getMerchantCountry())
                .customerCountry(txn.getCustomerCountry())
                .deviceId(txn.getDeviceId())
                .ipAddress(txn.getIpAddress())
                .timestamp(txn.getTimestamp())
                .fraud(txn.getFraud())
                .build();

        try {
            ResponseEntity<String> response =
                    restTemplate.postForEntity(url, dto, String.class);

            System.out.println("🔎 Detection Result: " + response.getBody());

        } catch (Exception e) {
            System.out.println("⚠ Detection service unavailable: " + e.getMessage());
        }
    }
}