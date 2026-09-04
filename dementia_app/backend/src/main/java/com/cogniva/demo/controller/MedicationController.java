package com.cogniva.demo.controller;

import com.cogniva.demo.exception.MedicationNotFoundException;
import com.cogniva.demo.exception.PatientReferenceNotFoundException;
import com.cogniva.demo.model.Medication;
import com.cogniva.demo.service.MedicationService;
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
@RequestMapping("/api/medications")
@Validated
public class MedicationController {

    private final MedicationService medicationService;
    private final SessionAccessService accessService;

    public MedicationController(
            MedicationService medicationService,
            SessionAccessService accessService) {
        this.medicationService = medicationService;
        this.accessService = accessService;
    }

    @GetMapping
    public ResponseEntity<List<Medication>> getAllMedications(
            HttpSession session) {

        return ResponseEntity.ok(
                medicationService.getMedicationsForCaregiver(
                        accessService.requireCaregiver(session)
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Medication> getMedicationById(
            @PathVariable @Positive Long id, HttpSession session) {

        Medication medication = medicationService.getMedicationById(id);
        accessService.requirePatientAccess(session, medication.getPatientId());

        return ResponseEntity.ok(medication);
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Medication>> getForPatient(
            @PathVariable @Positive Long patientId, HttpSession session) {
        accessService.requirePatientAccess(session, patientId);
        return ResponseEntity.ok(medicationService.getMedicationsForPatient(patientId));
    }

    @PostMapping
    public ResponseEntity<Medication> createMedication(
            @Valid @RequestBody Medication medication, HttpSession session) {

        accessService.requireCaregiver(session);
        accessService.requirePatientAccess(session, medication.getPatientId());

        Medication createdMedication =
                medicationService.createMedication(medication);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdMedication);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Medication> updateMedication(
            @PathVariable @Positive Long id,
            @Valid @RequestBody Medication medication, HttpSession session) {

        accessService.requireCaregiver(session);
        Medication existing = medicationService.getMedicationById(id);
        accessService.requirePatientAccess(session, existing.getPatientId());
        accessService.requirePatientAccess(session, medication.getPatientId());

        Medication updatedMedication =
                medicationService.updateMedication(id, medication);

        return ResponseEntity.ok(updatedMedication);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedication(
            @PathVariable @Positive Long id, HttpSession session) {

        accessService.requireCaregiver(session);
        Medication medication = medicationService.getMedicationById(id);
        accessService.requirePatientAccess(session, medication.getPatientId());

        medicationService.deleteMedication(id);

        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(MedicationNotFoundException.class)
    public ResponseEntity<String> handleMedicationNotFound(
            MedicationNotFoundException exception) {

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(exception.getMessage());
    }

    @ExceptionHandler(PatientReferenceNotFoundException.class)
    public ResponseEntity<String> handleInvalidPatientReference(
            PatientReferenceNotFoundException exception) {

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(exception.getMessage());
    }
}
