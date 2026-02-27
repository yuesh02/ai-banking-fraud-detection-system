package com.fraud.detection_core.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class MLScoringService {

    private final RestTemplate restTemplate = new RestTemplate();

    public double score(FeatureDTO features) {

        String url = "http://localhost:5000/predict";

        Map<String, Object> response =
                restTemplate.postForObject(url, features, Map.class);

        return ((Number) response.get("probability")).doubleValue();
    }
}