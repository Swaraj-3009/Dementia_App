package com.cogniva.demo.controller;

import com.cogniva.demo.dto.CognitiveGameSessionSaveRequest;
import com.cogniva.demo.dto.CognitiveGameSessionStartRequest;
import com.cogniva.demo.model.CognitiveGameSession;
import com.cogniva.demo.service.CognitiveGameSessionService;
import com.cogniva.demo.service.SessionAccessService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Positive;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cognitive-game/sessions")
@Validated
public class CognitiveGameSessionController {

    private final CognitiveGameSessionService sessionService;
    private final SessionAccessService accessService;

    public CognitiveGameSessionController(
            CognitiveGameSessionService sessionService,
            SessionAccessService accessService) {

        this.sessionService = sessionService;
        this.accessService = accessService;
    }

    /**
     * Starts a new cognitive game session.
     *
     * Reusing the same clientSessionId returns the existing
     * session instead of creating a duplicate.
     */
    @PostMapping
    public ResponseEntity<CognitiveGameSession> startSession(
            @Valid @RequestBody
            CognitiveGameSessionStartRequest request, HttpSession session) {
        accessService.requirePatientAccess(session, request.patientId());

        CognitiveGameSession session =
                sessionService.startSession(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(session);
    }

    /**
     * Saves or completes an existing game session.
     */
    @PutMapping("/{id}")
    public ResponseEntity<CognitiveGameSession> saveSession(
            @PathVariable @Positive Long id,
            @Valid @RequestBody
            CognitiveGameSessionSaveRequest request, HttpSession session) {
        accessService.requirePatientAccess(session, sessionService.getSession(id).getPatientId());

        CognitiveGameSession session =
                sessionService.saveSession(
                        id,
                        request
                );

        return ResponseEntity.ok(session);
    }

    /**
     * Retrieves one game session.
     */
    @GetMapping("/{id}")
    public ResponseEntity<CognitiveGameSession> getSession(
            @PathVariable @Positive Long id, HttpSession session) {

        accessService.requirePatientAccess(session, sessionService.getSession(id).getPatientId());

        return ResponseEntity.ok(
                sessionService.getSession(id)
        );
    }

    /**
     * Retrieves all cognitive-game results for a patient.
     */
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<CognitiveGameSession>>
    getPatientSessions(
            @PathVariable @Positive Long patientId, HttpSession session) {
        accessService.requirePatientAccess(session, patientId);

        return ResponseEntity.ok(
                sessionService.getSessionsForPatient(
                        patientId
                )
        );
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(
            IllegalArgumentException exception) {

        String message =
                exception.getMessage();

        if (message != null &&
                message.startsWith("Patient not found")) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(message);
        }

        if (message != null &&
                message.startsWith(
                        "Cognitive game session not found")) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(message);
        }

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(message);
    }
}
