package com.fraud.detection_core.controller;

import com.fraud.detection_core.entity.Transaction;
import com.fraud.detection_core.entity.FraudRisk;
import com.fraud.detection_core.service.DetectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;

@RestController
@RequestMapping("/detect")
@RequiredArgsConstructor
public class DetectionController {

    private final DetectionService detectionService;

    @PostMapping
public FraudRisk detect(
        @RequestBody Transaction transaction
) {
    return detectionService.evaluate(transaction);
}
}