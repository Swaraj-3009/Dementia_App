package com.cogniva.demo.dto;

import com.cogniva.demo.model.CognitiveGameSession;

import java.math.BigDecimal;
import java.util.List;

public record CognitivePerformanceAnalyticsResponse(
        Long patientId,
        long totalSessions,
        long completedSessions,
        BigDecimal averageScore,
        BigDecimal averageAccuracy,
        BigDecimal averageResponseTimeMs,
        List<CognitiveGameTypePerformance> performanceByGameType,
        List<CognitiveGameSession> recentSessions,
        List<CognitiveGameSession> history
) {
}