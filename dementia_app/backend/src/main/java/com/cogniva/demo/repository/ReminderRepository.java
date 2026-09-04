package com.cogniva.demo.repository;

import com.cogniva.demo.model.Reminder;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.List;
import java.util.Optional;

@Repository
public class ReminderRepository {

    private final JdbcTemplate jdbcTemplate;

    public ReminderRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Reminder create(Reminder reminder) {

        String sql = """
                INSERT INTO reminders
                (patient_id, title, description, reminder_time,
                 category, status, caregiver_visible)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement statement = connection.prepareStatement(
                    sql,
                    Statement.RETURN_GENERATED_KEYS
            );

            statement.setLong(1, reminder.getPatientId());
            statement.setString(2, reminder.getTitle());
            statement.setString(3, reminder.getDescription());
            statement.setObject(4, reminder.getReminderTime());
            statement.setString(5, reminder.getCategory());
            statement.setString(6, reminder.getStatus());
            statement.setBoolean(7, reminder.getCaregiverVisible());

            return statement;
        }, keyHolder);

        Number generatedId = keyHolder.getKey();

        if (generatedId == null) {
            throw new IllegalStateException("Failed to create reminder.");
        }

        return findById(generatedId.longValue())
                .orElseThrow(() ->
                        new IllegalStateException(
                                "Reminder was created but could not be retrieved."
                        ));
    }

    public List<Reminder> findAll() {

        String sql = """
                SELECT id, patient_id, title, description,
                       reminder_time, category, status,
                       caregiver_visible, created_at, updated_at
                FROM reminders
                ORDER BY reminder_time, id
                """;

        return jdbcTemplate.query(sql, this::mapRow);
    }

    public List<Reminder> findByCaregiverId(Long caregiverId) {
        String sql = """
                SELECT r.id, r.patient_id, r.title, r.description,
                       r.reminder_time, r.category, r.status,
                       r.caregiver_visible, r.created_at, r.updated_at
                FROM reminders r
                JOIN patients p ON p.id = r.patient_id
                WHERE p.caregiver_id = ?
                ORDER BY r.reminder_time, r.id
                """;

        return jdbcTemplate.query(sql, this::mapRow, caregiverId);
    }

    public List<Reminder> findByPatientId(Long patientId) {
        return jdbcTemplate.query("""
                SELECT id, patient_id, title, description, reminder_time, category, status,
                       caregiver_visible, created_at, updated_at
                FROM reminders WHERE patient_id = ? ORDER BY reminder_time, id
                """, this::mapRow, patientId);
    }

    public Reminder markCompleted(Long id) {
        jdbcTemplate.update("UPDATE reminders SET status = 'COMPLETED' WHERE id = ?", id);
        return findById(id).orElseThrow();
    }

    public Optional<Reminder> findById(Long id) {

        String sql = """
                SELECT id, patient_id, title, description,
                       reminder_time, category, status,
                       caregiver_visible, created_at, updated_at
                FROM reminders
                WHERE id = ?
                """;

        List<Reminder> reminders =
                jdbcTemplate.query(sql, this::mapRow, id);

        if (reminders.isEmpty()) {
            return Optional.empty();
        }

        return Optional.of(reminders.get(0));
    }

    public Reminder update(Long id, Reminder reminder) {

        String sql = """
                UPDATE reminders
                SET patient_id = ?,
                    title = ?,
                    description = ?,
                    reminder_time = ?,
                    category = ?,
                    status = ?,
                    caregiver_visible = ?
                WHERE id = ?
                """;

        int rowsUpdated = jdbcTemplate.update(
                sql,
                reminder.getPatientId(),
                reminder.getTitle(),
                reminder.getDescription(),
                reminder.getReminderTime(),
                reminder.getCategory(),
                reminder.getStatus(),
                reminder.getCaregiverVisible(),
                id
        );

        if (rowsUpdated == 0) {
            return null;
        }

        return findById(id).orElse(null);
    }

    public boolean delete(Long id) {

        String sql = "DELETE FROM reminders WHERE id = ?";

        return jdbcTemplate.update(sql, id) > 0;
    }

    private Reminder mapRow(ResultSet rs, int rowNum)
            throws java.sql.SQLException {

        return new Reminder(
                rs.getLong("id"),
                rs.getLong("patient_id"),
                rs.getString("title"),
                rs.getString("description"),
                rs.getObject("reminder_time", java.time.LocalTime.class),
                rs.getString("category"),
                rs.getString("status"),
                rs.getBoolean("caregiver_visible"),
                rs.getObject("created_at", java.time.LocalDateTime.class),
                rs.getObject("updated_at", java.time.LocalDateTime.class)
        );
    }
}
