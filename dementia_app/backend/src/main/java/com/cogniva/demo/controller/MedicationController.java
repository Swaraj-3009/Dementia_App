package com.cogniva.demo.controller;

import com.cogniva.demo.exception.MedicationNotFoundException;
import com.cogniva.demo.exception.PatientReferenceNotFoundException;
import com.cogniva.demo.model.Medication;
import com.cogniva.demo.service.MedicationService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/medications")
public class MedicationController {

    private final MedicationService medicationService;

    public MedicationController(MedicationService medicationService) {
        this.medicationService = medicationService;
    }

    @GetMapping
    public ResponseEntity<List<Medication>> getAllMedications() {

        return ResponseEntity.ok(
                medicationService.getAllMedications()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Medication> getMedicationById(
            @PathVariable @Positive Long id) {

        return ResponseEntity.ok(
                medicationService.getMedicationById(id)
        );
    }

    @PostMapping
    public ResponseEntity<Medication> createMedication(
            @Valid @RequestBody Medication medication) {

        Medication createdMedication =
                medicationService.createMedication(medication);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdMedication);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Medication> updateMedication(
            @PathVariable @Positive Long id,
            @Valid @RequestBody Medication medication) {

        Medication updatedMedication =
                medicationService.updateMedication(id, medication);

        return ResponseEntity.ok(updatedMedication);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMedication(
            @PathVariable @Positive Long id) {

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
