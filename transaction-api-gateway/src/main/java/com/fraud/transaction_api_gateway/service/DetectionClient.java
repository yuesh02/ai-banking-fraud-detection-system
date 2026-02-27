package com.fraud.transaction_api_gateway.service;

import com.fraud.transaction_api_gateway.entity.Transaction;
import com.fraud.transaction_api_gateway.service.dto.TransactionEventDTO;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class DetectionClient {

    private final RestTemplate restTemplate;

    public DetectionClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public void forward(Transaction txn) {

        String url = "http://localhost:8082/detect";

        // Map Entity → DTO for Detection Core
        TransactionEventDTO dto = TransactionEventDTO.builder()
                .transactionId(txn.getTransactionId())
                .customerId(txn.getCustomerId())
                .amount(txn.getAmount())
                .deviceId(txn.getDeviceId())
                .ipAddress(txn.getIpAddress())
                .merchantCountry(txn.getMerchantCountry())
                .merchantCategory(txn.getMerchantCategory())
                .timestamp(txn.getTimestamp())
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