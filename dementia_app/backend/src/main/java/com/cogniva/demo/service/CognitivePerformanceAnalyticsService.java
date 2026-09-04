package com.cogniva.demo.service;

import com.cogniva.demo.dto.CognitiveGameTypePerformance;
import com.cogniva.demo.dto.CognitivePerformanceAnalyticsResponse;
import com.cogniva.demo.model.CognitiveGameSession;
import com.cogniva.demo.repository.CognitiveGameSessionRepository;
import com.cogniva.demo.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class CognitivePerformanceAnalyticsService {

    private static final int RECENT_SESSION_LIMIT = 10;

    private final CognitiveGameSessionRepository sessionRepository;
    private final PatientRepository patientRepository;

    public CognitivePerformanceAnalyticsService(
            CognitiveGameSessionRepository sessionRepository,
            PatientRepository patientRepository) {

        this.sessionRepository = sessionRepository;
        this.patientRepository = patientRepository;
    }

    public CognitivePerformanceAnalyticsResponse getPatientAnalytics(
            Long patientId) {

        validatePatient(patientId);

        List<CognitiveGameSession> history =
                sessionRepository.findByPatientId(patientId);

        List<CognitiveGameSession> recentSessions =
                history.stream()
                        .limit(RECENT_SESSION_LIMIT)
                        .toList();

        long completedSessions =
                history.stream()
                        .filter(session ->
                                CognitiveGameSession.STATUS_COMPLETED
                                        .equals(session.getCompletionStatus()))
                        .count();

        return new CognitivePerformanceAnalyticsResponse(
                patientId,
                history.size(),
                completedSessions,
                averageScore(history),
                averageAccuracy(history),
                averageResponseTime(history),
                groupByGameType(history),
                recentSessions,
                history
        );
    }

    private List<CognitiveGameTypePerformance> groupByGameType(
            List<CognitiveGameSession> sessions) {

        Map<String, List<CognitiveGameSession>> grouped =
                new LinkedHashMap<>();

        for (CognitiveGameSession session : sessions) {
            grouped.computeIfAbsent(
                    session.getGameType(),
                    key -> new ArrayList<>()
            ).add(session);
        }

        return grouped.entrySet().stream()
                .map(entry -> {

                    List<CognitiveGameSession> gameSessions =
                            entry.getValue();

                    long completed =
                            gameSessions.stream()
                                    .filter(session ->
                                            CognitiveGameSession
                                                    .STATUS_COMPLETED
                                                    .equals(session
                                                            .getCompletionStatus()))
                                    .count();

                    return new CognitiveGameTypePerformance(
                            entry.getKey(),
                            gameSessions.size(),
                            completed,
                            averageScore(gameSessions),
                            averageAccuracy(gameSessions),
                            averageResponseTime(gameSessions)
                    );
                })
                .toList();
    }

    private BigDecimal averageScore(
            List<CognitiveGameSession> sessions) {

        return average(
                sessions.stream()
                        .map(CognitiveGameSession::getScore)
                        .filter(value -> value != null)
                        .map(BigDecimal::valueOf)
                        .toList()
        );
    }

    private BigDecimal averageAccuracy(
            List<CognitiveGameSession> sessions) {

        return average(
                sessions.stream()
                        .map(CognitiveGameSession::getAccuracy)
                        .filter(value -> value != null)
                        .toList()
        );
    }

    private BigDecimal averageResponseTime(
            List<CognitiveGameSession> sessions) {

        return average(
                sessions.stream()
                        .map(CognitiveGameSession::getResponseTimeMs)
                        .filter(value -> value != null)
                        .map(BigDecimal::valueOf)
                        .toList()
        );
    }

    private BigDecimal average(List<BigDecimal> values) {

        if (values.isEmpty()) {
            return BigDecimal.ZERO.setScale(
                    2,
                    RoundingMode.HALF_UP
            );
        }

        BigDecimal total =
                values.stream()
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

        return total.divide(
                BigDecimal.valueOf(values.size()),
                2,
                RoundingMode.HALF_UP
        );
    }

    private void validatePatient(Long patientId) {

        if (patientId == null ||
                patientRepository.findById(patientId).isEmpty()) {

            throw new IllegalArgumentException(
                    "Patient not found with ID: " + patientId
            );
        }
    }
}