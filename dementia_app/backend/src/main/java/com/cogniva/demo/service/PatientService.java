package com.cogniva.demo.service;

import com.cogniva.demo.exception.PatientNotFoundException;
import com.cogniva.demo.model.Patient;
import com.cogniva.demo.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientService {

    private final PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    public Patient createPatient(Patient patient) {
        return patientRepository.create(patient);
    }

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Patient getPatientById(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new PatientNotFoundException(id));
    }

    public Patient updatePatient(Long id, Patient patient) {
        Patient existingPatient = patientRepository.findById(id)
                .orElseThrow(() -> new PatientNotFoundException(id));

        patient.setId(existingPatient.getId());
        patient.setCreatedAt(existingPatient.getCreatedAt());

        Patient updatedPatient = patientRepository.update(id, patient);

        if (updatedPatient == null) {
            throw new PatientNotFoundException(id);
        }

        return updatedPatient;
    }

    public void deletePatient(Long id) {
        patientRepository.findById(id)
                .orElseThrow(() -> new PatientNotFoundException(id));

        boolean deleted = patientRepository.delete(id);

        if (!deleted) {
            throw new PatientNotFoundException(id);
        }
    }
}
