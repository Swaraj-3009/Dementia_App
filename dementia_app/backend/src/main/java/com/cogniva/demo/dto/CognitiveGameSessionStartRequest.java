package com.cogniva.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record CognitiveGameSessionStartRequest(

        @NotNull(message = "Patient ID is required")
        @Positive(message = "Patient ID must be positive")
        Long patientId,

        @NotBlank(message = "Game type is required")
        String gameType,

        @NotBlank(message = "Difficulty is required")
        String difficulty,

        @NotBlank(message = "Client session ID is required")
        String clientSessionId
) {
}