package com.cogniva.demo.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CognitiveGameSessionSaveRequest(

        LocalDateTime completedAt,

        @NotBlank(message = "Difficulty is required")
        String difficulty,

        @Min(value = 0, message = "Score cannot be negative")
        Integer score,

        @DecimalMin(
                value = "0.00",
                message = "Accuracy cannot be below 0"
        )
        @DecimalMax(
                value = "100.00",
                message = "Accuracy cannot exceed 100"
        )
        BigDecimal accuracy,

        @Min(
                value = 0,
                message = "Response time cannot be negative"
        )
        Long responseTimeMs,

        @Min(
                value = 0,
                message = "Correct count cannot be negative"
        )
        Integer correctCount,

        @Min(
                value = 0,
                message = "Incorrect count cannot be negative"
        )
        Integer incorrectCount,

        @NotBlank(message = "Completion status is required")
        String completionStatus
) {
}
