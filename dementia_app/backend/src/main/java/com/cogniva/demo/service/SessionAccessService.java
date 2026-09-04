package com.cogniva.demo.service;

import com.cogniva.demo.model.Patient;
import com.cogniva.demo.repository.PatientRepository;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

/** Centralizes role and patient-ownership checks for session-authenticated APIs. */
@Service
public class SessionAccessService {
    public static final String CAREGIVER_ID = "CAREGIVER_ID";
    public static final String PATIENT_ID = "PATIENT_ID";
    private final PatientRepository patientRepository;

    public SessionAccessService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    public void requirePatientAccess(HttpSession session, Long patientId) {
        Long patientSessionId = (Long) session.getAttribute(PATIENT_ID);
        if (patientSessionId != null) {
            if (!patientSessionId.equals(patientId)) forbidden();
            return;
        }
        Long caregiverId = (Long) session.getAttribute(CAREGIVER_ID);
        if (caregiverId == null) unauthorized();
        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Patient not found."));
        if (!caregiverId.equals(patient.getCaregiverId())) forbidden();
    }

    public Long requireCaregiver(HttpSession session) {
        Long caregiverId = (Long) session.getAttribute(CAREGIVER_ID);
        if (caregiverId == null) unauthorized();
        return caregiverId;
    }

    private void unauthorized() { throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Authentication required."); }
    private void forbidden() { throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You do not have access to this patient."); }
}
