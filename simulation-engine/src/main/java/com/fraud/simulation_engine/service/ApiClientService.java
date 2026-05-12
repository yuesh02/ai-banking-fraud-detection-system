package com.fraud.simulation_engine.service;

import com.fraud.simulation_engine.model.TransactionRequest;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class ApiClientService {

    private final RestTemplate restTemplate = new RestTemplate();

    @org.springframework.beans.factory.annotation.Value("${gateway.url:http://localhost:8080/api/v1/transactions}")
    private String gatewayUrl;

    public void sendTransaction(TransactionRequest request) {
        restTemplate.postForObject(gatewayUrl, request, String.class);
    }
}