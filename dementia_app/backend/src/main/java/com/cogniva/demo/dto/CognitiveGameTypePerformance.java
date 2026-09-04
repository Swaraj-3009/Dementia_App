package com.cogniva.demo.dto;

import java.math.BigDecimal;

public record CognitiveGameTypePerformance(
        String gameType,
        long sessionCount,
        long completedCount,
        BigDecimal averageScore,
        BigDecimal averageAccuracy,
        BigDecimal averageResponseTimeMs
) {
}
