package com.cogniva.demo.repository;

import com.cogniva.demo.model.Patient;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Types;
import java.util.List;
import java.util.Optional;

@Repository
public class PatientRepository {

    private final JdbcTemplate jdbcTemplate;

    public PatientRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    /**
     * Creates a new patient and returns the created Patient.
     */
    public Patient create(Patient patient) {

        String sql = """
                INSERT INTO patients
                    (caregiver_id, name, username, password_hash, date_of_birth, phone, address)
                VALUES
                    (?, ?, ?, ?, ?, ?, ?)
                """;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(
                    sql,
                    Statement.RETURN_GENERATED_KEYS
            );

            if (patient.getCaregiverId() != null) {
                ps.setLong(1, patient.getCaregiverId());
            } else {
                ps.setNull(1, Types.BIGINT);
            }

            ps.setString(2, patient.getName());

            ps.setString(3, patient.getUsername());
            ps.setString(4, patient.getPasswordHash());

            if (patient.getDateOfBirth() != null) {
                ps.setObject(5, patient.getDateOfBirth());
            } else {
                ps.setNull(5, Types.DATE);
            }

            ps.setString(6, patient.getPhone());
            ps.setString(7, patient.getAddress());

            return ps;
        }, keyHolder);

        Number generatedId = keyHolder.getKey();

        if (generatedId == null) {
            throw new IllegalStateException(
                    "Failed to retrieve generated patient ID."
            );
        }

        return findById(generatedId.longValue())
                .orElseThrow(() -> new IllegalStateException(
                        "Patient was created but could not be retrieved."
                ));
    }

    /**
     * Retrieves all patients.
     */
    public List<Patient> findAll() {

        String sql = """
                SELECT
                    id,
                    caregiver_id,
                    name,
                    date_of_birth,
                    phone,
                    address,
                    username,
                    password_hash,
                    created_at,
                    updated_at
                FROM patients
                ORDER BY id
                """;

        return jdbcTemplate.query(sql, this::mapRow);
    }

    public List<Patient> findByCaregiverId(Long caregiverId) {
        String sql = """
                SELECT id, caregiver_id, name, date_of_birth, phone, address,
                       username, password_hash, created_at, updated_at
                FROM patients
                WHERE caregiver_id = ?
                ORDER BY id
                """;
        return jdbcTemplate.query(sql, this::mapRow, caregiverId);
    }

    /**
     * Retrieves a patient by ID.
     */
    public Optional<Patient> findById(Long id) {

        String sql = """
                SELECT
                    id,
                    caregiver_id,
                    name,
                    date_of_birth,
                    phone,
                    address,
                    username,
                    password_hash,
                    created_at,
                    updated_at
                FROM patients
                WHERE id = ?
                """;

        List<Patient> patients = jdbcTemplate.query(
                sql,
                this::mapRow,
                id
        );

        return patients.stream().findFirst();
    }

    public Optional<Patient> findByUsername(String username) {
        String sql = """
                SELECT id, caregiver_id, name, date_of_birth, phone, address,
                       username, password_hash, created_at, updated_at
                FROM patients
                WHERE username = ?
                LIMIT 1
                """;
        return jdbcTemplate.query(sql, this::mapRow, username).stream().findFirst();
    }

    /**
     * Updates an existing patient.
     */
    public Patient update(Long id, Patient patient) {

        String sql = """
                UPDATE patients
                SET
                    caregiver_id = ?,
                    name = ?,
                    date_of_birth = ?,
                    phone = ?,
                    address = ?
                WHERE id = ?
                """;

        int rowsAffected = jdbcTemplate.update(
                sql,
                patient.getCaregiverId(),
                patient.getName(),
                patient.getDateOfBirth(),
                patient.getPhone(),
                patient.getAddress(),
                id
        );

        if (rowsAffected == 0) {
            return null;
        }

        return findById(id).orElse(null);
    }

    /**
     * Deletes a patient by ID.
     *
     * @return true if a patient was deleted, otherwise false.
     */
    public boolean delete(Long id) {

        String sql = """
                DELETE FROM patients
                WHERE id = ?
                """;

        int rowsAffected = jdbcTemplate.update(sql, id);

        return rowsAffected > 0;
    }

    /**
     * Maps a database row to the Patient model.
     */
    private Patient mapRow(ResultSet rs, int rowNum) throws SQLException {

        Patient patient = new Patient();

        patient.setId(rs.getLong("id"));

        long caregiverId = rs.getLong("caregiver_id");
        if (rs.wasNull()) {
            patient.setCaregiverId(null);
        } else {
            patient.setCaregiverId(caregiverId);
        }

        patient.setName(rs.getString("name"));
        patient.setDateOfBirth(
                rs.getObject("date_of_birth", java.time.LocalDate.class)
        );
        patient.setPhone(rs.getString("phone"));
        patient.setAddress(rs.getString("address"));
        patient.setUsername(rs.getString("username"));
        patient.setPasswordHash(rs.getString("password_hash"));

        patient.setCreatedAt(
                rs.getObject(
                        "created_at",
                        java.time.LocalDateTime.class
                )
        );

        patient.setUpdatedAt(
                rs.getObject(
                        "updated_at",
                        java.time.LocalDateTime.class
                )
        );

        return patient;
    }
}
