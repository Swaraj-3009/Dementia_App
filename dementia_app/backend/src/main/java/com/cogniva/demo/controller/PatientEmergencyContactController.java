package com.cogniva.demo.controller;

import com.cogniva.demo.model.EmergencyContact;
import com.cogniva.demo.repository.EmergencyContactRepository;
import com.cogniva.demo.service.SessionAccessService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patients/{patientId}/emergency-contact")
public class PatientEmergencyContactController {
    private final EmergencyContactRepository contacts;
    private final SessionAccessService access;
    public PatientEmergencyContactController(EmergencyContactRepository contacts, SessionAccessService access) {
        this.contacts = contacts; this.access = access;
    }
    @GetMapping
    public ResponseEntity<EmergencyContact> get(@PathVariable @Positive Long patientId, HttpSession session) {
        access.requirePatientAccess(session, patientId);
        return contacts.findByPatientId(patientId).map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }
    @PutMapping
    public ResponseEntity<EmergencyContact> save(@PathVariable @Positive Long patientId,
            @Valid @RequestBody EmergencyContact contact, HttpSession session) {
        access.requireCaregiver(session); access.requirePatientAccess(session, patientId);
        contact.setPatientId(patientId); return ResponseEntity.ok(contacts.save(contact));
    }
}
