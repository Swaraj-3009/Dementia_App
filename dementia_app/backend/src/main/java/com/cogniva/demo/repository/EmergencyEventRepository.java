package com.cogniva.demo.repository;

import com.cogniva.demo.model.EmergencyEvent;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

@Repository
public class EmergencyEventRepository {

    private final JdbcTemplate jdbcTemplate;

    public EmergencyEventRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public EmergencyEvent create(EmergencyEvent event) {

        String sql = """
                INSERT INTO emergency_events
                    (patient_id, status, description)
                VALUES (?, ?, ?)
                """;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement statement = connection.prepareStatement(
                    sql,
                    Statement.RETURN_GENERATED_KEYS
            );

            statement.setLong(1, event.getPatientId());
            statement.setString(2, event.getStatus());
            statement.setString(3, event.getDescription());

            return statement;
        }, keyHolder);

        Long generatedId = keyHolder.getKey().longValue();

        return findById(generatedId);
    }

    public EmergencyEvent findById(Long id) {

        String sql = """
                SELECT id,
                       patient_id,
                       event_timestamp,
                       status,
                       description
                FROM emergency_events
                WHERE id = ?
                """;

        return jdbcTemplate.queryForObject(
                sql,
                this::mapRow,
                id
        );
    }

    public List<EmergencyEvent> findByPatientId(Long patientId) {

        String sql = """
                SELECT id,
                       patient_id,
                       event_timestamp,
                       status,
                       description
                FROM emergency_events
                WHERE patient_id = ?
                ORDER BY event_timestamp DESC
                """;

        return jdbcTemplate.query(
                sql,
                this::mapRow,
                patientId
        );
    }

    private EmergencyEvent mapRow(
            java.sql.ResultSet rs,
            int rowNum) throws java.sql.SQLException {

        return new EmergencyEvent(
                rs.getLong("id"),
                rs.getLong("patient_id"),
                rs.getObject(
                        "event_timestamp",
                        java.time.LocalDateTime.class
                ),
                rs.getString("status"),
                rs.getString("description")
        );
    }
}
