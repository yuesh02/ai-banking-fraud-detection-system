package com.fraud.detection_core.repository;

import com.fraud.detection_core.entity.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import  java.util.*;
public interface FraudRiskRepository extends JpaRepository<FraudRisk, Long> {

    @Query("SELECT COUNT(f) FROM FraudRisk f")
Long countTotalTransactions();

@Query("SELECT COUNT(f) FROM FraudRisk f WHERE f.fraud = true")
Long countTotalFrauds();

@Query("SELECT AVG(f.riskScore) FROM FraudRisk f")
Double averageRiskScore();

@Query("""
       SELECT DATE(f.evaluatedAt) as date, COUNT(f) 
       FROM FraudRisk f 
       WHERE f.fraud = true
       GROUP BY DATE(f.evaluatedAt)
       ORDER BY DATE(f.evaluatedAt)
       """)
List<Object[]> fraudTrend();

@Query("""
       SELECT t.merchantId, COUNT(f) 
       FROM FraudRisk f 
       JOIN Transaction t ON f.transactionId = t.transactionId
       WHERE f.fraud = true
       GROUP BY t.merchantId
       ORDER BY COUNT(f) DESC
       """)
List<Object[]> topRiskyMerchants();

}