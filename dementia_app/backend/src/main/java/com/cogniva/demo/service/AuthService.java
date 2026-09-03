package com.cogniva.demo.service;

import com.cogniva.demo.model.Caregiver;
import com.cogniva.demo.repository.CaregiverRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final CaregiverRepository caregiverRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthService(
            CaregiverRepository caregiverRepository) {

        this.caregiverRepository = caregiverRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
    }

    public Caregiver authenticate(
            String identifier,
            String password) {

        Caregiver caregiver =
                caregiverRepository
                        .findByUsernameOrEmail(identifier)
                        .orElse(null);

        if (caregiver == null) {
            return null;
        }

        if (caregiver.getPasswordHash() == null) {
            return null;
        }

        boolean validPassword =
                passwordEncoder.matches(
                        password,
                        caregiver.getPasswordHash()
                );

        return validPassword ? caregiver : null;
    }

    public Caregiver getCaregiverById(Long id) {

        return caregiverRepository
                .findById(id)
                .orElse(null);
    }
}
