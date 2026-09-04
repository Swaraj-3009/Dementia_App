package com.cogniva.demo.dto;

public record AdaptiveDifficultyRecommendation(
        Long patientId,
        String gameType,
        String currentDifficulty,
        String recommendedDifficulty,
        String direction,
        String explanation,
        int sessionsUsed,
        double averageAccuracy,
        double averageResponseTimePerAnswerMs
) {
}
