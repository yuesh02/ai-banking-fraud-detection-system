package com.fraud.detection_core.store;

import com.fraud.detection_core.model.CustomerProfile;
import org.springframework.stereotype.Component;

import java.util.concurrent.ConcurrentHashMap;

@Component
public class ProfileStore {

    private final ConcurrentHashMap<String, CustomerProfile> profiles = new ConcurrentHashMap<>();

    public CustomerProfile getOrCreate(String customerId) {
        return profiles.computeIfAbsent(customerId, id -> {
            CustomerProfile profile = new CustomerProfile();
            profile.setCustomerId(id);
            return profile;
        });
    }
}