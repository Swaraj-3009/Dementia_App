package com.cogniva.demo.exception;

public class PatientNotFoundException extends RuntimeException {

    public PatientNotFoundException(Long patientId) {
        super("Patient not found with ID: " + patientId);
    }
}