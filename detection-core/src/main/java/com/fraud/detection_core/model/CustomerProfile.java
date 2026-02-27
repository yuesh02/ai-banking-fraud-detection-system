package com.fraud.detection_core.model;

import java.util.*;

public class CustomerProfile {

    private String customerId;
    private int totalTransactions;
    private double avgTransactionAmount;
    private Set<String> knownDevices = new HashSet<>();
    private Set<String> knownCountries = new HashSet<>();
    private List<Double> recentTransactions = new ArrayList<>();

    public String getCustomerId() { return customerId; }
    public void setCustomerId(String customerId) { this.customerId = customerId; }

    public int getTotalTransactions() { return totalTransactions; }
    public void setTotalTransactions(int totalTransactions) { this.totalTransactions = totalTransactions; }

    public double getAvgTransactionAmount() { return avgTransactionAmount; }
    public void setAvgTransactionAmount(double avgTransactionAmount) { this.avgTransactionAmount = avgTransactionAmount; }

    public Set<String> getKnownDevices() { return knownDevices; }
    public Set<String> getKnownCountries() { return knownCountries; }
    public List<Double> getRecentTransactions() { return recentTransactions; }
}