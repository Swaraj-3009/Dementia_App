package com.cogniva.demo.repository;

import com.cogniva.demo.model.Caregiver;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.util.List;
import java.util.Optional;

@Repository
public class CaregiverRepository {

    private final JdbcTemplate jdbcTemplate;

    public CaregiverRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Optional<Caregiver> findByUsernameOrEmail(
            String identifier) {

        String sql = """
                SELECT id, name, username, email, phone, password_hash
                FROM caregivers
                WHERE username = ? OR email = ?
                LIMIT 1
                """;

        List<Caregiver> caregivers =
                jdbcTemplate.query(
                        sql,
                        this::mapRow,
                        identifier,
                        identifier
                );

        if (caregivers.isEmpty()) {
            return Optional.empty();
        }

        return Optional.of(caregivers.get(0));
    }

    public Optional<Caregiver> findById(Long id) {

        String sql = """
                SELECT id, name, username, email, phone, password_hash
                FROM caregivers
                WHERE id = ?
                """;

        List<Caregiver> caregivers =
                jdbcTemplate.query(
                        sql,
                        this::mapRow,
                        id
                );

        if (caregivers.isEmpty()) {
            return Optional.empty();
        }

        return Optional.of(caregivers.get(0));
    }

    private Caregiver mapRow(
            ResultSet rs,
            int rowNum) throws java.sql.SQLException {

        return new Caregiver(
                rs.getLong("id"),
                rs.getString("name"),
                rs.getString("username"),
                rs.getString("email"),
                rs.getString("phone"),
                rs.getString("password_hash")
        );
    }
}
