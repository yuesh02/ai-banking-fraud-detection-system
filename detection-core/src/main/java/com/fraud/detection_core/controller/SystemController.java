package com.fraud.detection_core.controller;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/system")
@CrossOrigin
public class SystemController {

    @GetMapping("/health")
    public Map<String, Object> health() {

        return Map.of(
                "status", "UP",
                "database", "CONNECTED",
                "timestamp", LocalDateTime.now()
        );

    }
}