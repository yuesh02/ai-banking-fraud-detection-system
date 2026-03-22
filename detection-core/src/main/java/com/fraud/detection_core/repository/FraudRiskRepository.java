package com.fraud.detection_core.repository;
import com.fraud.detection_core.entity.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import  java.util.*;
public interface FraudRiskRepository extends JpaRepository<FraudRisk, Long> {

List<FraudRisk> findByRiskLevel(RiskLevel riskLevel);

List<FraudRisk> findByFraud(Boolean fraud);
Page<FraudRisk> findByRiskLevelOrderByTimestampDesc(
            RiskLevel riskLevel,
            Pageable pageable
    );
    @Query("SELECT COUNT(f) FROM FraudRisk f")
Long countTotalTransactions();

@Query("SELECT COUNT(f) FROM FraudRisk f WHERE f.fraud = true")
Long countTotalFrauds();

@Query("SELECT AVG(f.riskScore) FROM FraudRisk f")
Double averageRiskScore();

@Query("""
SELECT DATE(f.timestamp), COUNT(f)
FROM FraudRisk f
WHERE f.fraud = true
AND f.timestamp IS NOT NULL
GROUP BY DATE(f.timestamp)
ORDER BY DATE(f.timestamp)
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
Optional<FraudRisk> findByTransactionId(
        String transactionId
);
FraudRisk findTopByTransactionIdOrderByTimestampDesc(String transactionId);
@Query("""
           SELECT f FROM FraudRisk f ORDER BY f.timestamp DESC   
              """) 
List<FraudRisk> findRecentTransactions(Pageable pageable);
@Query("""
SELECT f
FROM FraudRisk f
WHERE
(:riskLevel IS NULL OR f.riskLevel = :riskLevel)
AND
(:fraud IS NULL OR f.fraud = :fraud)
AND
(:startDate IS NULL OR f.timestamp >= :startDate)
AND
(:endDate IS NULL OR f.timestamp <= :endDate)
ORDER BY f.timestamp DESC
""")
Page<FraudRisk> searchTransactions(
        RiskLevel riskLevel,
        Boolean fraud,
        java.time.LocalDateTime startDate,
        java.time.LocalDateTime endDate,
        Pageable pageable
);




}