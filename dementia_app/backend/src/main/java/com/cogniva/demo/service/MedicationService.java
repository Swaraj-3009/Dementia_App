package com.cogniva.demo.service;

import com.cogniva.demo.exception.MedicationNotFoundException;
import com.cogniva.demo.exception.PatientReferenceNotFoundException;
import com.cogniva.demo.model.Medication;
import com.cogniva.demo.repository.MedicationRepository;
import com.cogniva.demo.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicationService {

    private final MedicationRepository medicationRepository;
    private final PatientRepository patientRepository;

    public MedicationService(
            MedicationRepository medicationRepository,
            PatientRepository patientRepository) {

        this.medicationRepository = medicationRepository;
        this.patientRepository = patientRepository;
    }

    public Medication createMedication(Medication medication) {

        validatePatientReference(medication.getPatientId());

        return medicationRepository.create(medication);
    }

    public List<Medication> getAllMedications() {
        return medicationRepository.findAll();
    }

    public List<Medication> getMedicationsForCaregiver(Long caregiverId) {
        return medicationRepository.findByCaregiverId(caregiverId);
    }

    public List<Medication> getMedicationsForPatient(Long patientId) {
        validatePatientReference(patientId);
        return medicationRepository.findByPatientId(patientId);
    }

    public Medication getMedicationById(Long id) {

        return medicationRepository.findById(id)
                .orElseThrow(() ->
                        new MedicationNotFoundException(id));
    }

    public Medication updateMedication(
            Long id,
            Medication medication) {

        Medication existingMedication =
                medicationRepository.findById(id)
                        .orElseThrow(() ->
                                new MedicationNotFoundException(id));

        validatePatientReference(medication.getPatientId());

        medication.setId(existingMedication.getId());
        medication.setCreatedAt(existingMedication.getCreatedAt());

        Medication updatedMedication =
                medicationRepository.update(id, medication);

        if (updatedMedication == null) {
            throw new MedicationNotFoundException(id);
        }

        return updatedMedication;
    }

    public void deleteMedication(Long id) {

        medicationRepository.findById(id)
                .orElseThrow(() ->
                        new MedicationNotFoundException(id));

        boolean deleted = medicationRepository.delete(id);

        if (!deleted) {
            throw new MedicationNotFoundException(id);
        }
    }

    private void validatePatientReference(Long patientId) {

        if (patientId == null ||
                patientRepository.findById(patientId).isEmpty()) {

            throw new PatientReferenceNotFoundException(patientId);
        }
    }
}
