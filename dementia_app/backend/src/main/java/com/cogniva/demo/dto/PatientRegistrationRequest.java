package com.cogniva.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record PatientRegistrationRequest(
        @NotBlank @Size(max = 100) String name,
        @NotBlank @Size(max = 100) String username,
        @NotBlank @Size(min = 8, max = 100) String password,
        LocalDate dateOfBirth,
        @Size(max = 20) String phone,
        @Size(max = 255) String address) { }
