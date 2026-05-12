package com.fraud.detection_core.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class MLScoringService {

    private final RestTemplate restTemplate = new RestTemplate();

    @org.springframework.beans.factory.annotation.Value("${ml.service.url:http://127.0.0.1:5000/predict}")
    private String mlServiceUrl;

    public double score(FeatureDTO features) {
        try {
            log.info("Sending feature vector to ML Service: {}", features);
            Map<String, Object> response =
                    restTemplate.postForObject(mlServiceUrl, features, Map.class);

            if (response != null && response.containsKey("probability")) {
                return ((Number) response.get("probability")).doubleValue();
            }
        } catch (org.springframework.web.client.ResourceAccessException e) {
            log.error("ML SERVICE CONNECTION REFUSED: Ensure the Python service is running on port 5000. Error: {}", e.getMessage());
        } catch (org.springframework.web.client.RestClientException e) {
            log.error("ML SERVICE PROTOCOL ERROR: The service returned an error. Check Python console. Error: {}", e.getMessage());
        } catch (Exception e) {
            log.error("ML Service is down or timed out. Falling back to rule-based scoring: {}", e.getMessage());
        }
        
        // Return -1.0 as a circuit-breaker flag so Detection Core can rely purely on rules
        return -1.0;
    }
}