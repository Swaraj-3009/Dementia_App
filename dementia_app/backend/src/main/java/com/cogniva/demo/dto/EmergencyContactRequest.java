package com.cogniva.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Contact fields supplied by a caregiver; the patient is identified by the URL. */
public record EmergencyContactRequest(
        @NotBlank(message = "Contact name is required")
        @Size(max = 100, message = "Contact name must be at most 100 characters")
        String name,

        @NotBlank(message = "Contact phone is required")
        @Size(max = 20, message = "Contact phone must be at most 20 characters")
        String phone,

        @Size(max = 100, message = "Relationship must be at most 100 characters")
        String relationship) {
}
