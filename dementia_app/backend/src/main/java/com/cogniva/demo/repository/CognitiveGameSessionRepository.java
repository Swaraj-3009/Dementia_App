package com.cogniva.demo.repository;

import com.cogniva.demo.model.CognitiveGameSession;
//import org.springframework.dao.DuplicateKeyException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;

@Repository
public class CognitiveGameSessionRepository {

    private final JdbcTemplate jdbcTemplate;

    public CognitiveGameSessionRepository(
            JdbcTemplate jdbcTemplate) {

        this.jdbcTemplate = jdbcTemplate;
    }

    public CognitiveGameSession create(
            CognitiveGameSession session) {

        String sql = """
                INSERT INTO cognitive_game_sessions
                (
                    patient_id,
                    game_type,
                    started_at,
                    completed_at,
                    difficulty,
                    score,
                    accuracy,
                    response_time_ms,
                    correct_count,
                    incorrect_count,
                    completion_status,
                    client_session_id
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """;

        KeyHolder keyHolder =
                new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {

            PreparedStatement statement =
                    connection.prepareStatement(
                            sql,
                            Statement.RETURN_GENERATED_KEYS
                    );

            statement.setLong(
                    1,
                    session.getPatientId()
            );

            statement.setString(
                    2,
                    session.getGameType()
            );

            statement.setObject(
                    3,
                    session.getStartedAt()
            );

            statement.setObject(
                    4,
                    session.getCompletedAt()
            );

            statement.setString(
                    5,
                    session.getDifficulty()
            );

            statement.setInt(
                    6,
                    session.getScore()
            );

            statement.setBigDecimal(
                    7,
                    session.getAccuracy()
            );

            statement.setLong(
                    8,
                    session.getResponseTimeMs()
            );

            statement.setInt(
                    9,
                    session.getCorrectCount()
            );

            statement.setInt(
                    10,
                    session.getIncorrectCount()
            );

            statement.setString(
                    11,
                    session.getCompletionStatus()
            );

            statement.setString(
                    12,
                    session.getClientSessionId()
            );

            return statement;

        }, keyHolder);

        Number generatedId =
                keyHolder.getKey();

        if (generatedId == null) {
            throw new IllegalStateException(
                    "Failed to create cognitive game session."
            );
        }

        return findById(generatedId.longValue())
                .orElseThrow(() ->
                        new IllegalStateException(
                                "Cognitive game session was created " +
                                "but could not be retrieved."
                        )
                );
    }

    public Optional<CognitiveGameSession> findById(
            Long id) {

        String sql = """
                SELECT
                    id,
                    patient_id,
                    game_type,
                    started_at,
                    completed_at,
                    difficulty,
                    score,
                    accuracy,
                    response_time_ms,
                    correct_count,
                    incorrect_count,
                    completion_status,
                    client_session_id,
                    created_at
                FROM cognitive_game_sessions
                WHERE id = ?
                """;

        List<CognitiveGameSession> sessions =
                jdbcTemplate.query(
                        sql,
                        this::mapRow,
                        id
                );

        return sessions.stream().findFirst();
    }

    public Optional<CognitiveGameSession>
    findByClientSessionId(String clientSessionId) {

        String sql = """
                SELECT
                    id,
                    patient_id,
                    game_type,
                    started_at,
                    completed_at,
                    difficulty,
                    score,
                    accuracy,
                    response_time_ms,
                    correct_count,
                    incorrect_count,
                    completion_status,
                    client_session_id,
                    created_at
                FROM cognitive_game_sessions
                WHERE client_session_id = ?
                """;

        List<CognitiveGameSession> sessions =
                jdbcTemplate.query(
                        sql,
                        this::mapRow,
                        clientSessionId
                );

        return sessions.stream().findFirst();
    }

    public List<CognitiveGameSession> findByPatientId(
            Long patientId) {

        String sql = """
                SELECT
                    id,
                    patient_id,
                    game_type,
                    started_at,
                    completed_at,
                    difficulty,
                    score,
                    accuracy,
                    response_time_ms,
                    correct_count,
                    incorrect_count,
                    completion_status,
                    client_session_id,
                    created_at
                FROM cognitive_game_sessions
                WHERE patient_id = ?
                ORDER BY created_at DESC, id DESC
                """;

        return jdbcTemplate.query(
                sql,
                this::mapRow,
                patientId
        );
    }

    public CognitiveGameSession update(
            Long id,
            CognitiveGameSession session) {

        String sql = """
                UPDATE cognitive_game_sessions
                SET
                    completed_at = ?,
                    difficulty = ?,
                    score = ?,
                    accuracy = ?,
                    response_time_ms = ?,
                    correct_count = ?,
                    incorrect_count = ?,
                    completion_status = ?
                WHERE id = ?
                """;

        int rowsUpdated =
                jdbcTemplate.update(
                        sql,
                        session.getCompletedAt(),
                        session.getDifficulty(),
                        session.getScore(),
                        session.getAccuracy(),
                        session.getResponseTimeMs(),
                        session.getCorrectCount(),
                        session.getIncorrectCount(),
                        session.getCompletionStatus(),
                        id
                );

        if (rowsUpdated == 0) {
            return null;
        }

        return findById(id).orElse(null);
    }

    private CognitiveGameSession mapRow(
            java.sql.ResultSet rs,
            int rowNum)
            throws java.sql.SQLException {

        CognitiveGameSession session =
                new CognitiveGameSession();

        session.setId(
                rs.getLong("id")
        );

        session.setPatientId(
                rs.getLong("patient_id")
        );

        session.setGameType(
                rs.getString("game_type")
        );

        session.setStartedAt(
                rs.getObject(
                        "started_at",
                        java.time.LocalDateTime.class
                )
        );

        session.setCompletedAt(
                rs.getObject(
                        "completed_at",
                        java.time.LocalDateTime.class
                )
        );

        session.setDifficulty(
                rs.getString("difficulty")
        );

        session.setScore(
                rs.getInt("score")
        );

        session.setAccuracy(
                rs.getBigDecimal("accuracy")
        );

        session.setResponseTimeMs(
                rs.getLong("response_time_ms")
        );

        session.setCorrectCount(
                rs.getInt("correct_count")
        );

        session.setIncorrectCount(
                rs.getInt("incorrect_count")
        );

        session.setCompletionStatus(
                rs.getString("completion_status")
        );

        session.setClientSessionId(
                rs.getString("client_session_id")
        );

        session.setCreatedAt(
                rs.getObject(
                        "created_at",
                        java.time.LocalDateTime.class
                )
        );

        return session;
    }
}