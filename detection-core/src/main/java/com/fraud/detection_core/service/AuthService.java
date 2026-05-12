package com.fraud.detection_core.service;

import com.fraud.detection_core.dto.LoginRequestDTO;
import com.fraud.detection_core.dto.LoginResponseDTO;
import com.fraud.detection_core.entity.User;
import com.fraud.detection_core.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    public LoginResponseDTO login(LoginRequestDTO request) {

        Optional<User> optionalUser = userRepository.findByUsername(request.getUsername());
        User user;

        if (optionalUser.isEmpty()) {
            if ("admin".equals(request.getUsername())) {
                // Auto-create admin user for demo purposes if it doesn't exist
                user = new User();
                user.setUsername("admin");
                user.setPassword("admin");
                user.setRole("ADMIN");
                userRepository.save(user);
            } else {
                throw new RuntimeException("User not found");
            }
        } else {
            user = optionalUser.get();
        }

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