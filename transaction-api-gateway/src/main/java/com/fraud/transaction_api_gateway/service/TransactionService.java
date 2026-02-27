package com.fraud.transaction_api_gateway.service;

import com.fraud.transaction_api_gateway.entity.Transaction;
import com.fraud.transaction_api_gateway.repository.TransactionRepository;
import org.springframework.stereotype.Service;
import org.springframework.dao.DataIntegrityViolationException;
@Service
public class TransactionService {

    private final TransactionRepository repository;
    private final DetectionClient detectionClient;

    public TransactionService(TransactionRepository repository,
                              DetectionClient detectionClient) {
        this.repository = repository;
        this.detectionClient = detectionClient;
    }

    public Transaction saveTransaction(Transaction transaction) {

    try {
        detectionClient.forward(transaction);
        
        return repository.save(transaction);
    } catch (DataIntegrityViolationException ex) {
        throw new RuntimeException("Transaction ID already exists");
    }
}
}