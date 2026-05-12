package com.fraud.detection_core.controller;

import com.fraud.detection_core.service.SystemGuardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/system")
@CrossOrigin
@RequiredArgsConstructor
public class SystemController {

    private final SystemGuardService systemGuard;

    @GetMapping("/health")
    public Map<String, Object> health() {
        return Map.of(
                "status", "UP",
                "database", "CONNECTED",
                "timestamp", LocalDateTime.now()
        );
    }

    @GetMapping("/freezes")
    public Map<String, LocalDateTime> getFreezes() {
        return systemGuard.getActiveFreezes();
    }

    @DeleteMapping("/freezes/{merchantId}")
    public void unfreeze(@PathVariable String merchantId) {
        systemGuard.clearFreeze(merchantId);
    }
}