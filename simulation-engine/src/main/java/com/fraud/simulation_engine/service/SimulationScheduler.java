package com.fraud.simulation_engine.service;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SimulationScheduler {

    private final SimulationService simulationService;
    private final ApiClientService apiClientService;

    @Scheduled(fixedRate = 3000)
    public void generateAndSend() {

        var txn = simulationService.generateTransaction();
        apiClientService.sendTransaction(txn);

        System.out.println("Transaction Sent: " + txn.getTransactionId());
    }
}