package com.cogniva.demo.repository;

import com.cogniva.demo.model.Caregiver;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import java.sql.Statement;
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

    public Caregiver create(Caregiver caregiver) {
        KeyHolder keys = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            var statement = connection.prepareStatement(
                    "INSERT INTO caregivers (name, username, email, phone, password_hash) VALUES (?, ?, ?, ?, ?)",
                    Statement.RETURN_GENERATED_KEYS);
            statement.setString(1, caregiver.getName()); statement.setString(2, caregiver.getUsername());
            statement.setString(3, caregiver.getEmail()); statement.setString(4, caregiver.getPhone());
            statement.setString(5, caregiver.getPasswordHash()); return statement;
        }, keys);
        return findById(keys.getKey().longValue()).orElseThrow();
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
