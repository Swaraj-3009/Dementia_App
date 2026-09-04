package com.cogniva.demo.service;

import com.cogniva.demo.dto.CognitiveGameSessionSaveRequest;
import com.cogniva.demo.dto.CognitiveGameSessionStartRequest;
import com.cogniva.demo.model.CognitiveGameSession;
import com.cogniva.demo.repository.CognitiveGameSessionRepository;
import com.cogniva.demo.repository.PatientRepository;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class CognitiveGameSessionService {

    private final CognitiveGameSessionRepository sessionRepository;
    private final PatientRepository patientRepository;

    public CognitiveGameSessionService(
            CognitiveGameSessionRepository sessionRepository,
            PatientRepository patientRepository) {

        this.sessionRepository = sessionRepository;
        this.patientRepository = patientRepository;
    }

    public CognitiveGameSession startSession(
            CognitiveGameSessionStartRequest request) {

        validatePatient(request.patientId());

        String gameType =
                normalize(request.gameType());

        String difficulty =
                normalize(request.difficulty());

        validateGameType(gameType);
        validateDifficulty(difficulty);

        String clientSessionId =
                request.clientSessionId().trim();

        if (clientSessionId.isEmpty()) {
            throw new IllegalArgumentException(
                    "Client session ID is required."
            );
        }

        /*
         * Idempotency:
         * If the browser sends the same client session again,
         * return the existing database session instead of
         * creating another row.
         */
        var existing =
                sessionRepository.findByClientSessionId(
                        clientSessionId
                );

        if (existing.isPresent()) {
            return existing.get();
        }

        CognitiveGameSession session =
                new CognitiveGameSession();

        session.setPatientId(request.patientId());
        session.setGameType(gameType);
        session.setStartedAt(LocalDateTime.now());
        session.setDifficulty(difficulty);
        session.setScore(0);
        session.setAccuracy(BigDecimal.ZERO);
        session.setResponseTimeMs(0L);
        session.setCorrectCount(0);
        session.setIncorrectCount(0);
        session.setCompletionStatus(
                CognitiveGameSession.STATUS_IN_PROGRESS
        );
        session.setClientSessionId(clientSessionId);

        try {

            return sessionRepository.create(session);

        } catch (DuplicateKeyException exception) {

            /*
             * Protect against two simultaneous requests using
             * the same idempotency key.
             */
            return sessionRepository
                    .findByClientSessionId(clientSessionId)
                    .orElseThrow(() -> exception);
        }
    }

    public CognitiveGameSession saveSession(
            Long id,
            CognitiveGameSessionSaveRequest request) {

        // CognitiveGameSession existing =
        //         sessionRepository.findById(id)
        //                 .orElseThrow(() ->
        //                         new IllegalArgumentException(
        //                                 "Cognitive game session not found with ID: "
        //                                         + id
        //                         )
        //                 );

        String difficulty =
                normalize(request.difficulty());

        String status =
                normalize(request.completionStatus());

        validateDifficulty(difficulty);
        validateCompletionStatus(status);

        int score =
                request.score() == null
                        ? 0
                        : request.score();

        BigDecimal accuracy =
                request.accuracy() == null
                        ? BigDecimal.ZERO
                        : request.accuracy();

        long responseTime =
                request.responseTimeMs() == null
                        ? 0L
                        : request.responseTimeMs();

        int correctCount =
                request.correctCount() == null
                        ? 0
                        : request.correctCount();

        int incorrectCount =
                request.incorrectCount() == null
                        ? 0
                        : request.incorrectCount();

        validateAccuracy(accuracy);

        CognitiveGameSession updated =
                new CognitiveGameSession();

        updated.setCompletedAt(
                request.completedAt()
        );

        updated.setDifficulty(difficulty);
        updated.setScore(score);
        updated.setAccuracy(accuracy);
        updated.setResponseTimeMs(responseTime);
        updated.setCorrectCount(correctCount);
        updated.setIncorrectCount(incorrectCount);
        updated.setCompletionStatus(status);

        CognitiveGameSession result =
                sessionRepository.update(
                        id,
                        updated
                );

        if (result == null) {
            throw new IllegalArgumentException(
                    "Cognitive game session not found with ID: "
                            + id
            );
        }

        return result;
    }

    public CognitiveGameSession getSession(Long id) {

        return sessionRepository.findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Cognitive game session not found with ID: "
                                        + id
                        )
                );
    }

    public List<CognitiveGameSession>
    getSessionsForPatient(Long patientId) {

        validatePatient(patientId);

        return sessionRepository.findByPatientId(
                patientId
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

    private void validateCompletionStatus(
            String status) {

        if (!CognitiveGameSession.STATUS_IN_PROGRESS
                .equals(status)
                && !CognitiveGameSession.STATUS_COMPLETED
                .equals(status)
                && !CognitiveGameSession.STATUS_ABANDONED
                .equals(status)) {

            throw new IllegalArgumentException(
                    "Unsupported completion status: " + status
            );
        }
    }

    private void validateAccuracy(
            BigDecimal accuracy) {

        if (accuracy.compareTo(BigDecimal.ZERO) < 0
                || accuracy.compareTo(
                new BigDecimal("100.00")
        ) > 0) {

            throw new IllegalArgumentException(
                    "Accuracy must be between 0 and 100."
            );
        }
    }

    private String normalize(String value) {

        return value.trim().toUpperCase();
    }
}
