package com.cogniva.demo.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CognitiveGameSession {

    public static final String GAME_MEMORY = "MEMORY";
    public static final String GAME_ATTENTION = "ATTENTION";
    public static final String GAME_DAILY_ROUTINE_RECALL =
            "DAILY_ROUTINE_RECALL";
    public static final String GAME_PATTERN_RECOGNITION =
            "PATTERN_RECOGNITION";

    public static final String DIFFICULTY_EASY = "EASY";
    public static final String DIFFICULTY_MEDIUM = "MEDIUM";
    public static final String DIFFICULTY_HARD = "HARD";

    public static final String STATUS_IN_PROGRESS = "IN_PROGRESS";
    public static final String STATUS_COMPLETED = "COMPLETED";
    public static final String STATUS_ABANDONED = "ABANDONED";

    private Long id;
    private Long patientId;
    private String gameType;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private String difficulty;
    private Integer score;
    private BigDecimal accuracy;
    private Long responseTimeMs;
    private Integer correctCount;
    private Integer incorrectCount;
    private String completionStatus;
    private String clientSessionId;
    private LocalDateTime createdAt;

    public CognitiveGameSession() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public String getGameType() {
        return gameType;
    }

    public void setGameType(String gameType) {
        this.gameType = gameType;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public String getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }

    public Integer getScore() {
        return score;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public BigDecimal getAccuracy() {
        return accuracy;
    }

    public void setAccuracy(BigDecimal accuracy) {
        this.accuracy = accuracy;
    }

    public Long getResponseTimeMs() {
        return responseTimeMs;
    }

    public void setResponseTimeMs(Long responseTimeMs) {
        this.responseTimeMs = responseTimeMs;
    }

    public Integer getCorrectCount() {
        return correctCount;
    }

    public void setCorrectCount(Integer correctCount) {
        this.correctCount = correctCount;
    }

    public Integer getIncorrectCount() {
        return incorrectCount;
    }

    public void setIncorrectCount(Integer incorrectCount) {
        this.incorrectCount = incorrectCount;
    }

    public String getCompletionStatus() {
        return completionStatus;
    }

    public void setCompletionStatus(String completionStatus) {
        this.completionStatus = completionStatus;
    }

    public String getClientSessionId() {
        return clientSessionId;
    }

    public void setClientSessionId(String clientSessionId) {
        this.clientSessionId = clientSessionId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}