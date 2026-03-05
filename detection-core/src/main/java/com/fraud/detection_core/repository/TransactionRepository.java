package com.fraud.detection_core.repository;

import com.fraud.detection_core.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByCustomerId(String customerId);

    @Query("SELECT SUM(t.amount) FROM Transaction t")
Double totalTransactionAmount();

@Query("""
       SELECT t.merchantCountry, COUNT(f)
       FROM FraudRisk f
       JOIN Transaction t ON f.transactionId = t.transactionId
       WHERE f.fraud = true
       GROUP BY t.merchantCountry
       """)
List<Object[]> fraudByCountry();
@Query("SELECT HOUR(t.timestamp), COUNT(t) FROM Transaction t GROUP BY HOUR(t.timestamp)")
List<Object[]> transactionsPerHour();

@Query("""
SELECT 
CASE 
WHEN f.riskScore BETWEEN 0 AND 20 THEN '0-20'
WHEN f.riskScore BETWEEN 21 AND 40 THEN '21-40'
WHEN f.riskScore BETWEEN 41 AND 60 THEN '41-60'
WHEN f.riskScore BETWEEN 61 AND 80 THEN '61-80'
ELSE '81-100'
END,
COUNT(f)
FROM FraudRisk f
GROUP BY 
CASE 
WHEN f.riskScore BETWEEN 0 AND 20 THEN '0-20'
WHEN f.riskScore BETWEEN 21 AND 40 THEN '21-40'
WHEN f.riskScore BETWEEN 41 AND 60 THEN '41-60'
WHEN f.riskScore BETWEEN 61 AND 80 THEN '61-80'
ELSE '81-100'
END
""")
List<Object[]> riskDistribution();
}