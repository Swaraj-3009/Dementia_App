package com.cogniva.demo.controller;

import com.cogniva.demo.dto.CognitivePerformanceAnalyticsResponse;
import com.cogniva.demo.service.CognitivePerformanceAnalyticsService;
import com.cogniva.demo.service.SessionAccessService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.constraints.Positive;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cognitive-game/analytics")
public class CognitivePerformanceAnalyticsController {

    private final CognitivePerformanceAnalyticsService analyticsService;
    private final SessionAccessService accessService;

    public CognitivePerformanceAnalyticsController(
            CognitivePerformanceAnalyticsService analyticsService,
            SessionAccessService accessService) {

        this.analyticsService = analyticsService;
        this.accessService = accessService;
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<CognitivePerformanceAnalyticsResponse>
    getPatientAnalytics(
            @PathVariable @Positive Long patientId, HttpSession session) {
        accessService.requirePatientAccess(session, patientId);

        return ResponseEntity.ok(
                analyticsService.getPatientAnalytics(patientId)
        );
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(
            IllegalArgumentException exception) {

        String message = exception.getMessage();

        if (message != null &&
                message.startsWith("Patient not found")) {

            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body(message);
        }

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(message);
    }
}
