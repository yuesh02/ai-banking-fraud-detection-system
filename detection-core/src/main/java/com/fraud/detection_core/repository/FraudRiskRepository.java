package com.fraud.detection_core.repository;

import com.fraud.detection_core.entity.FraudRisk;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface FraudRiskRepository extends JpaRepository<FraudRisk, Long> {

}