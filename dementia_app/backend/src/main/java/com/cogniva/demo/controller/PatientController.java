package com.cogniva.demo.controller;

import com.cogniva.demo.exception.PatientNotFoundException;
import com.cogniva.demo.model.Patient;
import com.cogniva.demo.service.PatientService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    /**
     * GET /api/patients
     * Returns all patients.
     */
    @GetMapping
    public ResponseEntity<List<Patient>> getAllPatients() {
        return ResponseEntity.ok(patientService.getAllPatients());
    }

    /**
     * GET /api/patients/{id}
     * Returns a patient by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(
            @PathVariable @Positive Long id) {

        return ResponseEntity.ok(patientService.getPatientById(id));
    }

    /**
     * POST /api/patients
     * Creates a new patient.
     */
    @PostMapping
    public ResponseEntity<Patient> createPatient(
            @Valid @RequestBody Patient patient) {

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
            @Valid @RequestBody Patient patient) {

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
            @PathVariable @Positive Long id) {

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