package com.fraud.detection_core.dto;

import lombok.Data;

@Data
public class LoginResponseDTO {

    private String username;
    private String role;
    private String message;
}