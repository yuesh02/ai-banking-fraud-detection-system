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

        // 15% chance of burst (velocity attack)
        int burst =
                Math.random() < 0.15
                        ? 5
                        : 1;

        for (int i = 0; i < burst; i++) {

            var txn =
                    simulationService
                            .generateTransaction();

            apiClientService
                    .sendTransaction(txn);

            System.out.println(
                    "Transaction Sent: "
                            + txn.getTransactionId()
                            + " Fraud: "
                            + txn.getFraud()
            );
        }
    }
}