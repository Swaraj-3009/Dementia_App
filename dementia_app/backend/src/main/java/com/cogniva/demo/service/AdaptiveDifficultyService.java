package com.cogniva.demo.service;

import com.cogniva.demo.dto.AdaptiveDifficultyRecommendation;
import com.cogniva.demo.model.CognitiveGameSession;
import com.cogniva.demo.repository.CognitiveGameSessionRepository;
import com.cogniva.demo.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AdaptiveDifficultyService {

    private final CognitiveGameSessionRepository sessionRepository;
    private final PatientRepository patientRepository;

    public AdaptiveDifficultyService(
            CognitiveGameSessionRepository sessionRepository,
            PatientRepository patientRepository) {

        this.sessionRepository = sessionRepository;
        this.patientRepository = patientRepository;
    }

    public AdaptiveDifficultyRecommendation recommend(
            Long patientId,
            String gameType,
            String currentDifficulty) {

        validatePatient(patientId);

        String normalizedGameType =
                normalize(gameType);

        String normalizedCurrentDifficulty =
                normalize(currentDifficulty);

        validateGameType(normalizedGameType);
        validateDifficulty(normalizedCurrentDifficulty);

        List<CognitiveGameSession> recentSessions =
                getRecentCompletedSessions(
                        patientId,
                        normalizedGameType
                );

        if (recentSessions.size() <
                AdaptiveDifficultyConfig.MIN_SESSIONS_FOR_ADAPTATION) {

            return new AdaptiveDifficultyRecommendation(
                    patientId,
                    normalizedGameType,
                    normalizedCurrentDifficulty,
                    normalizedCurrentDifficulty,
                    "MAINTAIN",
                    "There are not enough recent completed sessions " +
                    "to change difficulty, so the current difficulty is kept.",
                    recentSessions.size(),
                    averageAccuracy(recentSessions),
                    averageResponseTimePerAnswer(recentSessions)
            );
        }

        double averageAccuracy =
                averageAccuracy(recentSessions);

        double averageResponseTime =
                averageResponseTimePerAnswer(recentSessions);

        boolean consistentlyFast =
                recentSessions.stream()
                        .allMatch(this::isFastSession);

        boolean repeatedFailures =
                hasRepeatedFailures(recentSessions);

        /*
         * Rule 1:
         * Repeated recent failures decrease difficulty.
         */
        if (averageAccuracy <
                AdaptiveDifficultyConfig.LOW_ACCURACY_PERCENT
                || repeatedFailures) {

            String recommended =
                    decreaseDifficulty(
                            normalizedCurrentDifficulty
                    );

            return buildRecommendation(
                    patientId,
                    normalizedGameType,
                    normalizedCurrentDifficulty,
                    recommended,
                    "DECREASE",
                    "Recent performance is below the configured " +
                    "50% accuracy threshold or shows repeated low results.",
                    recentSessions,
                    averageAccuracy,
                    averageResponseTime
            );
        }

        /*
         * Rule 2:
         * High accuracy + consistently fast responses
         * increase difficulty.
         */
        if (averageAccuracy >=
                AdaptiveDifficultyConfig.HIGH_ACCURACY_PERCENT
                && consistentlyFast) {

            String recommended =
                    increaseDifficulty(
                            normalizedCurrentDifficulty
                    );

            return buildRecommendation(
                    patientId,
                    normalizedGameType,
                    normalizedCurrentDifficulty,
                    recommended,
                    "INCREASE",
                    "Recent accuracy is at least 80% and responses " +
                    "have consistently been within the configured fast-response threshold.",
                    recentSessions,
                    averageAccuracy,
                    averageResponseTime
            );
        }

        /*
         * Rule 3:
         * Everything else maintains the current difficulty.
         */
        return buildRecommendation(
                patientId,
                normalizedGameType,
                normalizedCurrentDifficulty,
                normalizedCurrentDifficulty,
                "MAINTAIN",
                "Recent performance is in the configured maintain range, " +
                "or the high-accuracy response-speed condition was not met.",
                recentSessions,
                averageAccuracy,
                averageResponseTime
        );
    }

    private List<CognitiveGameSession> getRecentCompletedSessions(
            Long patientId,
            String gameType) {

        List<CognitiveGameSession> allSessions =
                sessionRepository.findByPatientId(patientId);

        List<CognitiveGameSession> result =
                new ArrayList<>();

        for (CognitiveGameSession session : allSessions) {

            if (!gameType.equals(session.getGameType())) {
                continue;
            }

            if (!CognitiveGameSession.STATUS_COMPLETED
                    .equals(session.getCompletionStatus())) {
                continue;
            }

            result.add(session);

            if (result.size() >=
                    AdaptiveDifficultyConfig.RECENT_SESSION_COUNT) {
                break;
            }
        }

        return result;
    }

    private boolean isFastSession(
            CognitiveGameSession session) {

        long answerCount =
                safeInt(session.getCorrectCount())
                + safeInt(session.getIncorrectCount());

        if (answerCount <= 0) {
            return false;
        }

        long responseTime =
                safeLong(session.getResponseTimeMs());

        double responsePerAnswer =
                (double) responseTime / answerCount;

        return responsePerAnswer <=
                AdaptiveDifficultyConfig.FAST_RESPONSE_PER_ANSWER_MS;
    }

    private boolean hasRepeatedFailures(
            List<CognitiveGameSession> sessions) {

        int failures = 0;

        for (CognitiveGameSession session : sessions) {

            if (session.getAccuracy() != null
                    && session.getAccuracy().doubleValue()
                    < AdaptiveDifficultyConfig.LOW_ACCURACY_PERCENT) {

                failures++;

                if (failures >=
                        AdaptiveDifficultyConfig.REPEATED_FAILURE_SESSIONS) {
                    return true;
                }

            } else {
                /*
                 * Only consecutive low-performing sessions count
                 * as repeated failures.
                 */
                failures = 0;
            }
        }

        return false;
    }

    private double averageAccuracy(
            List<CognitiveGameSession> sessions) {

        if (sessions.isEmpty()) {
            return 0.0;
        }

        double total = 0.0;
        int count = 0;

        for (CognitiveGameSession session : sessions) {

            if (session.getAccuracy() != null) {
                total += session.getAccuracy().doubleValue();
                count++;
            }
        }

        return count == 0 ? 0.0 : total / count;
    }

    private double averageResponseTimePerAnswer(
            List<CognitiveGameSession> sessions) {

        double total = 0.0;
        int count = 0;

        for (CognitiveGameSession session : sessions) {

            long answers =
                    safeInt(session.getCorrectCount())
                    + safeInt(session.getIncorrectCount());

            if (answers <= 0) {
                continue;
            }

            total +=
                    (double) safeLong(session.getResponseTimeMs())
                    / answers;

            count++;
        }

        return count == 0 ? 0.0 : total / count;
    }

    private AdaptiveDifficultyRecommendation buildRecommendation(
            Long patientId,
            String gameType,
            String currentDifficulty,
            String recommendedDifficulty,
            String direction,
            String explanation,
            List<CognitiveGameSession> sessions,
            double averageAccuracy,
            double averageResponseTime) {

        return new AdaptiveDifficultyRecommendation(
                patientId,
                gameType,
                currentDifficulty,
                recommendedDifficulty,
                direction,
                explanation,
                sessions.size(),
                round(averageAccuracy),
                round(averageResponseTime)
        );
    }

    private String increaseDifficulty(
            String difficulty) {

        if (CognitiveGameSession.DIFFICULTY_EASY
                .equals(difficulty)) {

            return CognitiveGameSession.DIFFICULTY_MEDIUM;
        }

        if (CognitiveGameSession.DIFFICULTY_MEDIUM
                .equals(difficulty)) {

            return CognitiveGameSession.DIFFICULTY_HARD;
        }

        return CognitiveGameSession.DIFFICULTY_HARD;
    }

    private String decreaseDifficulty(
            String difficulty) {

        if (CognitiveGameSession.DIFFICULTY_HARD
                .equals(difficulty)) {

            return CognitiveGameSession.DIFFICULTY_MEDIUM;
        }

        if (CognitiveGameSession.DIFFICULTY_MEDIUM
                .equals(difficulty)) {

            return CognitiveGameSession.DIFFICULTY_EASY;
        }

        return CognitiveGameSession.DIFFICULTY_EASY;
    }

    private void validatePatient(Long patientId) {

        if (patientId == null
                || patientRepository.findById(patientId).isEmpty()) {

            throw new IllegalArgumentException(
                    "Patient not found with ID: " + patientId
            );
        }
    }

    private void validateGameType(String gameType) {

        if (!CognitiveGameSession.GAME_MEMORY.equals(gameType)
                && !CognitiveGameSession.GAME_ATTENTION.equals(gameType)
                && !CognitiveGameSession.GAME_DAILY_ROUTINE_RECALL
                        .equals(gameType)
                && !CognitiveGameSession.GAME_PATTERN_RECOGNITION
                        .equals(gameType)) {

            throw new IllegalArgumentException(
                    "Unsupported game type: " + gameType
            );
        }
    }

    private void validateDifficulty(String difficulty) {

        if (!CognitiveGameSession.DIFFICULTY_EASY.equals(difficulty)
                && !CognitiveGameSession.DIFFICULTY_MEDIUM.equals(difficulty)
                && !CognitiveGameSession.DIFFICULTY_HARD.equals(difficulty)) {

            throw new IllegalArgumentException(
                    "Unsupported difficulty: " + difficulty
            );
        }
    }

    private String normalize(String value) {

        if (value == null) {
            throw new IllegalArgumentException(
                    "Required value is missing."
            );
        }

        return value.trim().toUpperCase();
    }

    private int safeInt(Integer value) {
        return value == null ? 0 : value;
    }

    private long safeLong(Long value) {
        return value == null ? 0L : value;
    }

    private double round(double value) {
        return Math.round(value * 100.0) / 100.0;
    }
}
