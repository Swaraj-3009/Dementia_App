package com.cogniva.demo.repository;

import com.cogniva.demo.model.Medication;
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
public class MedicationRepository {

    private final JdbcTemplate jdbcTemplate;

    public MedicationRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Medication create(Medication medication) {

        String sql = """
                INSERT INTO medications
                (patient_id, name, dosage, frequency, instructions, start_date, end_date)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement statement = connection.prepareStatement(
                    sql,
                    Statement.RETURN_GENERATED_KEYS
            );

            statement.setLong(1, medication.getPatientId());
            statement.setString(2, medication.getName());
            statement.setString(3, medication.getDosage());
            statement.setString(4, medication.getFrequency());
            statement.setString(5, medication.getInstructions());

            if (medication.getStartDate() != null) {
                statement.setObject(6, medication.getStartDate());
            } else {
                statement.setObject(6, null);
            }

            if (medication.getEndDate() != null) {
                statement.setObject(7, medication.getEndDate());
            } else {
                statement.setObject(7, null);
            }

            return statement;
        }, keyHolder);

        Number generatedId = keyHolder.getKey();

        if (generatedId == null) {
            throw new IllegalStateException("Failed to create medication.");
        }

        return findById(generatedId.longValue())
                .orElseThrow(() ->
                        new IllegalStateException("Medication was created but could not be retrieved.")
                );
    }

    public List<Medication> findAll() {

        String sql = """
                SELECT id, patient_id, name, dosage, frequency,
                       instructions, start_date, end_date, created_at
                FROM medications
                ORDER BY id
                """;

        return jdbcTemplate.query(sql, this::mapRow);
    }

    public List<Medication> findByCaregiverId(Long caregiverId) {
        String sql = """
                SELECT m.id, m.patient_id, m.name, m.dosage, m.frequency,
                       m.instructions, m.start_date, m.end_date, m.created_at
                FROM medications m
                JOIN patients p ON p.id = m.patient_id
                WHERE p.caregiver_id = ?
                ORDER BY m.id
                """;

        return jdbcTemplate.query(sql, this::mapRow, caregiverId);
    }

    public List<Medication> findByPatientId(Long patientId) {
        return jdbcTemplate.query("""
                SELECT id, patient_id, name, dosage, frequency, instructions, start_date, end_date, created_at
                FROM medications WHERE patient_id = ? ORDER BY id
                """, this::mapRow, patientId);
    }

    public Optional<Medication> findById(Long id) {

        String sql = """
                SELECT id, patient_id, name, dosage, frequency,
                       instructions, start_date, end_date, created_at
                FROM medications
                WHERE id = ?
                """;

        List<Medication> medications =
                jdbcTemplate.query(sql, this::mapRow, id);

        if (medications.isEmpty()) {
            return Optional.empty();
        }

        return Optional.of(medications.get(0));
    }

    public Medication update(Long id, Medication medication) {

        String sql = """
                UPDATE medications
                SET patient_id = ?,
                    name = ?,
                    dosage = ?,
                    frequency = ?,
                    instructions = ?,
                    start_date = ?,
                    end_date = ?
                WHERE id = ?
                """;

        int rowsUpdated = jdbcTemplate.update(
                sql,
                medication.getPatientId(),
                medication.getName(),
                medication.getDosage(),
                medication.getFrequency(),
                medication.getInstructions(),
                medication.getStartDate(),
                medication.getEndDate(),
                id
        );

        if (rowsUpdated == 0) {
            return null;
        }

        return findById(id).orElse(null);
    }

    public boolean delete(Long id) {

        String sql = "DELETE FROM medications WHERE id = ?";

        return jdbcTemplate.update(sql, id) > 0;
    }

    private Medication mapRow(ResultSet rs, int rowNum)
            throws java.sql.SQLException {

        return new Medication(
                rs.getLong("id"),
                rs.getLong("patient_id"),
                rs.getString("name"),
                rs.getString("dosage"),
                rs.getString("frequency"),
                rs.getString("instructions"),
                rs.getObject("start_date", java.time.LocalDate.class),
                rs.getObject("end_date", java.time.LocalDate.class),
                rs.getObject("created_at", java.time.LocalDateTime.class)
        );
    }
}
