package com.cogniva.demo.service;

import com.cogniva.demo.model.Caregiver;
import com.cogniva.demo.repository.CaregiverRepository;
import com.cogniva.demo.model.Patient;
import com.cogniva.demo.repository.PatientRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final CaregiverRepository caregiverRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final PatientRepository patientRepository;

    public AuthService(
            CaregiverRepository caregiverRepository,
            PatientRepository patientRepository) {

        this.caregiverRepository = caregiverRepository;
        this.passwordEncoder = new BCryptPasswordEncoder();
        this.patientRepository = patientRepository;
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

    public Patient authenticatePatient(String identifier, String password) {
        Patient patient = patientRepository.findByUsername(identifier).orElse(null);
        if (patient == null || patient.getPasswordHash() == null) {
            return null;
        }
        return passwordEncoder.matches(password, patient.getPasswordHash())
                ? patient : null;
    }

    public Patient getPatientById(Long id) {
        return patientRepository.findById(id).orElse(null);
    }
}
