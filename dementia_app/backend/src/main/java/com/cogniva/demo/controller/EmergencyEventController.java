package com.cogniva.demo.controller;

import com.cogniva.demo.model.EmergencyEvent;
import com.cogniva.demo.service.EmergencyEventService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emergency-events")
public class EmergencyEventController {

    private final EmergencyEventService emergencyEventService;

    public EmergencyEventController(
            EmergencyEventService emergencyEventService) {
        this.emergencyEventService = emergencyEventService;
    }

    @PostMapping
    public ResponseEntity<?> createEmergencyEvent(
            @Valid @RequestBody EmergencyEventRequest request,
            HttpSession session) {

        if (session.getAttribute("CAREGIVER_ID") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Authentication required");
        }

        EmergencyEvent event =
                emergencyEventService.createEmergencyEvent(
                        request.patientId(),
                        request.description()
                );

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(event);
    }

    @GetMapping
    public ResponseEntity<?> getEmergencyEvents(
            @RequestParam @Positive Long patientId,
            HttpSession session) {

        if (session.getAttribute("CAREGIVER_ID") == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Authentication required");
        }

        List<EmergencyEvent> events =
                emergencyEventService.getEventsForPatient(patientId);

        return ResponseEntity.ok(events);
    }

    public record EmergencyEventRequest(

            @NotNull(message = "Patient ID is required")
            @Positive(message = "Patient ID must be positive")
            Long patientId,

            @NotBlank(message = "Event description is required")
            String description
    ) {
    }
}