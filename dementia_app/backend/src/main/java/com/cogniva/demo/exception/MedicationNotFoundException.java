package com.cogniva.demo.exception;

public class MedicationNotFoundException extends RuntimeException {

    public MedicationNotFoundException(Long medicationId) {
        super("Medication not found with ID: " + medicationId);
    }
}
