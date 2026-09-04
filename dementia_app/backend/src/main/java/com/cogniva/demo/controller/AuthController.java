package com.cogniva.demo.controller;

import com.cogniva.demo.dto.CaregiverResponse;
import com.cogniva.demo.dto.LoginRequest;
import com.cogniva.demo.dto.CaregiverRegistrationRequest;
import com.cogniva.demo.model.Caregiver;
import com.cogniva.demo.model.Patient;
import com.cogniva.demo.service.AuthService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final String CAREGIVER_ID =
            "CAREGIVER_ID";
    private static final String PATIENT_ID = "PATIENT_ID";

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest request,
            HttpSession session) {

        Caregiver caregiver =
                authService.authenticate(
                        request.getIdentifier(),
                        request.getPassword()
                );

        if (caregiver == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid username/email or password.");
        }

        session.setAttribute(
                CAREGIVER_ID,
                caregiver.getId()
        );
        session.removeAttribute(PATIENT_ID);

        return ResponseEntity.ok(
                toResponse(caregiver)
        );
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(
            @Valid @RequestBody CaregiverRegistrationRequest request,
            HttpSession session) {
        Caregiver caregiver = authService.registerCaregiver(request.name(), request.username(),
                request.email(), request.phone(), request.password());
        session.setAttribute(CAREGIVER_ID, caregiver.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(caregiver));
    }

    @PostMapping("/patient/login")
    public ResponseEntity<?> patientLogin(
            @Valid @RequestBody LoginRequest request,
            HttpSession session) {
        Patient patient = authService.authenticatePatient(
                request.getIdentifier(), request.getPassword());
        if (patient == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid patient username or password.");
        }
        session.removeAttribute(CAREGIVER_ID);
        session.setAttribute(PATIENT_ID, patient.getId());
        return ResponseEntity.ok(patientResponse(patient));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            HttpSession session) {

        session.invalidate();

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<?> currentCaregiver(
            HttpSession session) {

        Long caregiverId =
                (Long) session.getAttribute(CAREGIVER_ID);

        if (caregiverId == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Authentication required.");
        }

        Caregiver caregiver =
                authService.getCaregiverById(caregiverId);

        if (caregiver == null) {

            session.invalidate();

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Authentication required.");
        }

        return ResponseEntity.ok(
                toResponse(caregiver)
        );
    }

    @GetMapping("/patient/me")
    public ResponseEntity<?> currentPatient(HttpSession session) {
        Long patientId = (Long) session.getAttribute(PATIENT_ID);
        Patient patient = patientId == null ? null : authService.getPatientById(patientId);
        if (patient == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Authentication required.");
        }
        return ResponseEntity.ok(patientResponse(patient));
    }

    private CaregiverResponse toResponse(
            Caregiver caregiver) {

        return new CaregiverResponse(
                caregiver.getId(),
                caregiver.getName(),
                caregiver.getUsername(),
                caregiver.getEmail(),
                caregiver.getPhone()
        );
    }

    private java.util.Map<String, Object> patientResponse(Patient patient) {
        return java.util.Map.of(
                "id", patient.getId(),
                "name", patient.getName(),
                "username", patient.getUsername() == null ? "" : patient.getUsername(),
                "role", "PATIENT"
        );
    }
}
