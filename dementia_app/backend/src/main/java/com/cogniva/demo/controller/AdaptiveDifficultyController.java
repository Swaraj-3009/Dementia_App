package com.cogniva.demo.controller;

import com.cogniva.demo.dto.AdaptiveDifficultyRecommendation;
import com.cogniva.demo.service.AdaptiveDifficultyService;
import com.cogniva.demo.service.SessionAccessService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.constraints.Positive;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cognitive-game/adaptive")
public class AdaptiveDifficultyController {

    private final AdaptiveDifficultyService adaptiveDifficultyService;
    private final SessionAccessService accessService;

    public AdaptiveDifficultyController(
            AdaptiveDifficultyService adaptiveDifficultyService,
            SessionAccessService accessService) {

        this.adaptiveDifficultyService =
                adaptiveDifficultyService;
        this.accessService = accessService;
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<AdaptiveDifficultyRecommendation>
    getRecommendation(
            @PathVariable @Positive Long patientId,
            @RequestParam String gameType,
            @RequestParam String currentDifficulty,
            HttpSession session) {
        accessService.requirePatientAccess(session, patientId);

        return ResponseEntity.ok(
                adaptiveDifficultyService.recommend(
                        patientId,
                        gameType,
                        currentDifficulty
                )
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
