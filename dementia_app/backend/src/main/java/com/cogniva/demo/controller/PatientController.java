package com.cogniva.demo.controller;

import com.cogniva.demo.exception.PatientNotFoundException;
import com.cogniva.demo.model.Patient;
import com.cogniva.demo.service.PatientService;
import com.cogniva.demo.service.SessionAccessService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@Validated
public class PatientController {

    private final PatientService patientService;
    private final SessionAccessService accessService;

    public PatientController(PatientService patientService, SessionAccessService accessService) {
        this.patientService = patientService;
        this.accessService = accessService;
    }

    /**
     * GET /api/patients
     * Returns all patients.
     */
    @GetMapping
    public ResponseEntity<List<Patient>> getAllPatients(HttpSession session) {
        return ResponseEntity.ok(patientService.getPatientsForCaregiver(accessService.requireCaregiver(session)));
    }

    /**
     * GET /api/patients/{id}
     * Returns a patient by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(
            @PathVariable @Positive Long id, HttpSession session) {
        accessService.requirePatientAccess(session, id);

        return ResponseEntity.ok(patientService.getPatientById(id));
    }

    /**
     * POST /api/patients
     * Creates a new patient.
     */
    @PostMapping
    public ResponseEntity<Patient> createPatient(
            @Valid @RequestBody Patient patient, HttpSession session) {
        patient.setCaregiverId(accessService.requireCaregiver(session));

        Patient createdPatient = patientService.createPatient(patient);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdPatient);
    }

    /**
     * PUT /api/patients/{id}
     * Updates an existing patient.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Patient> updatePatient(
            @PathVariable @Positive Long id,
            @Valid @RequestBody Patient patient, HttpSession session) {
        Long caregiverId = accessService.requireCaregiver(session);
        accessService.requirePatientAccess(session, id);
        patient.setCaregiverId(caregiverId);

        Patient updatedPatient =
                patientService.updatePatient(id, patient);

        return ResponseEntity.ok(updatedPatient);
    }

    /**
     * DELETE /api/patients/{id}
     * Deletes an existing patient.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(
            @PathVariable @Positive Long id, HttpSession session) {
        accessService.requirePatientAccess(session, id);

        patientService.deletePatient(id);

        return ResponseEntity.noContent().build();
    }

    /**
     * Converts a missing patient into HTTP 404.
     */
    @ExceptionHandler(PatientNotFoundException.class)
    public ResponseEntity<String> handlePatientNotFound(
            PatientNotFoundException exception) {

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(exception.getMessage());
    }
}
