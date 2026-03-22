package com.fraud.detection_core.service;

import com.fraud.detection_core.dto.LoginRequestDTO;
import com.fraud.detection_core.dto.LoginResponseDTO;
import com.fraud.detection_core.entity.User;
import com.fraud.detection_core.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    public LoginResponseDTO login(LoginRequestDTO request) {

        User user = userRepository
                .findByUsername(request.getUsername())
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        LoginResponseDTO response = new LoginResponseDTO();

        response.setUsername(user.getUsername());
        response.setRole(user.getRole());
        response.setMessage("Login successful");

        return response;
    }
}