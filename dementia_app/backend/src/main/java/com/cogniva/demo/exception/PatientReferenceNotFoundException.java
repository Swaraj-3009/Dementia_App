package com.cogniva.demo.exception;

public class PatientReferenceNotFoundException extends RuntimeException {

    public PatientReferenceNotFoundException(Long patientId) {
        super("Patient not found with ID: " + patientId);
    }
}
