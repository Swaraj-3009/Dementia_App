package com.cogniva.demo.repository;

import com.cogniva.demo.model.EmergencyContact;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public class EmergencyContactRepository {
    private final JdbcTemplate jdbcTemplate;
    public EmergencyContactRepository(JdbcTemplate jdbcTemplate) { this.jdbcTemplate = jdbcTemplate; }

    public Optional<EmergencyContact> findByPatientId(Long patientId) {
        return jdbcTemplate.query("SELECT id, patient_id, name, phone, relationship FROM emergency_contacts WHERE patient_id = ?",
                (rs, row) -> map(rs), patientId).stream().findFirst();
    }

    public EmergencyContact save(EmergencyContact contact) {
        jdbcTemplate.update("""
                INSERT INTO emergency_contacts (patient_id, name, phone, relationship)
                VALUES (?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE name = VALUES(name), phone = VALUES(phone), relationship = VALUES(relationship)
                """, contact.getPatientId(), contact.getName(), contact.getPhone(), contact.getRelationship());
        return findByPatientId(contact.getPatientId()).orElseThrow();
    }

    private EmergencyContact map(java.sql.ResultSet rs) throws java.sql.SQLException {
        EmergencyContact contact = new EmergencyContact();
        contact.setId(rs.getLong("id")); contact.setPatientId(rs.getLong("patient_id"));
        contact.setName(rs.getString("name")); contact.setPhone(rs.getString("phone"));
        contact.setRelationship(rs.getString("relationship")); return contact;
    }
}
