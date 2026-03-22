package com.fraud.detection_core.controller;

import com.fraud.detection_core.dto.LoginRequestDTO;
import com.fraud.detection_core.dto.LoginResponseDTO;
import com.fraud.detection_core.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@CrossOrigin
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public LoginResponseDTO login(
            @RequestBody LoginRequestDTO request) {

        return authService.login(request);
    }
}