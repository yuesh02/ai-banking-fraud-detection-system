package com.fraud.transaction_api_gateway.controller;

import com.fraud.transaction_api_gateway.entity.Transaction;
import com.fraud.transaction_api_gateway.service.TransactionService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/transactions")   
public class TransactionController {

    private final TransactionService service;

    public TransactionController(TransactionService service) {
        this.service = service;
    }

    @PostMapping
    public Transaction create(@RequestBody Transaction transaction) {
        return service.saveTransaction(transaction);
    }
}