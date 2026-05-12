package com.fraud.detection_core.service;

import com.fraud.detection_core.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FraudRingService {

    private final TransactionRepository transactionRepository;

    public List<Map<String, Object>> findFraudRings() {
        // Simple logic: Group by DeviceId or IP and see if there are multiple CustomerIds
        var allTxns = transactionRepository.findAll();
        
        Map<String, Set<String>> deviceToCustomers = new HashMap<>();
        Map<String, Set<String>> ipToCustomers = new HashMap<>();

        for (var t : allTxns) {
            if (t.getDeviceId() != null) {
                deviceToCustomers.computeIfAbsent(t.getDeviceId(), k -> new HashSet<>()).add(t.getCustomerId());
            }
            if (t.getIpAddress() != null) {
                ipToCustomers.computeIfAbsent(t.getIpAddress(), k -> new HashSet<>()).add(t.getCustomerId());
            }
        }

        List<Map<String, Object>> rings = new ArrayList<>();

        // Process Device Rings
        deviceToCustomers.forEach((device, customers) -> {
            if (customers.size() > 1) {
                Map<String, Object> ring = new HashMap<>();
                ring.put("type", "DEVICE_LINK");
                ring.put("identifier", device);
                ring.put("customers", customers);
                ring.put("severity", customers.size() > 3 ? "CRITICAL" : "HIGH");
                rings.add(ring);
            }
        });

        // Process IP Rings
        ipToCustomers.forEach((ip, customers) -> {
            if (customers.size() > 1) {
                Map<String, Object> ring = new HashMap<>();
                ring.put("type", "IP_LINK");
                ring.put("identifier", ip);
                ring.put("customers", customers);
                ring.put("severity", customers.size() > 3 ? "CRITICAL" : "HIGH");
                rings.add(ring);
            }
        });

        return rings;
    }
}
