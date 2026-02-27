package com.fraud.transaction_api_gateway.repository;

import com.fraud.transaction_api_gateway.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
}