package com.cogniva.demo.service;

import com.cogniva.demo.model.EmergencyEvent;
import com.cogniva.demo.repository.EmergencyEventRepository;
import com.cogniva.demo.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmergencyEventService {

    private final EmergencyEventRepository emergencyEventRepository;
    private final PatientRepository patientRepository;

    public EmergencyEventService(
            EmergencyEventRepository emergencyEventRepository,
            PatientRepository patientRepository) {

        this.emergencyEventRepository = emergencyEventRepository;
        this.patientRepository = patientRepository;
    }

    public EmergencyEvent createEmergencyEvent(
            Long patientId,
            String description) {

        patientRepository.findById(patientId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Patient not found with ID: " + patientId
                        )
                );

        EmergencyEvent event = new EmergencyEvent();

        event.setPatientId(patientId);
        event.setStatus("TRIGGERED");
        event.setDescription(description);

        return emergencyEventRepository.create(event);
    }

    public List<EmergencyEvent> getEventsForPatient(Long patientId) {

        patientRepository.findById(patientId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Patient not found with ID: " + patientId
                        )
                );

        return emergencyEventRepository.findByPatientId(patientId);
    }
}
