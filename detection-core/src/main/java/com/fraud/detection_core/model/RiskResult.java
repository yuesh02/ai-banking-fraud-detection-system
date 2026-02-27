package com.fraud.detection_core.model;

public class RiskResult {

    private int riskScore;
    private String reasons;
    private boolean fraud;

    public RiskResult() {}

    public RiskResult(int riskScore, String reasons, boolean fraud) {
        this.riskScore = riskScore;
        this.reasons = reasons;
        this.fraud = fraud;
    }

    public int getRiskScore() { return riskScore; }
    public void setRiskScore(int riskScore) { this.riskScore = riskScore; }

    public String getReasons() { return reasons; }
    public void setReasons(String reasons) { this.reasons = reasons; }

    public boolean isFraud() { return fraud; }
    public void setFraud(boolean fraud) { this.fraud = fraud; }
}