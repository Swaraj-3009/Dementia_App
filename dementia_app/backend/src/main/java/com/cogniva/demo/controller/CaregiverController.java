package com.cogniva.demo.controller;

import com.cogniva.demo.dto.CaregiverResponse;
import com.cogniva.demo.model.Caregiver;
import com.cogniva.demo.service.AuthService;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/caregiver")
public class CaregiverController {

    private static final String CAREGIVER_ID =
            "CAREGIVER_ID";

    private final AuthService authService;

    public CaregiverController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(
            HttpSession session) {

        Long caregiverId =
                (Long) session.getAttribute(CAREGIVER_ID);

        if (caregiverId == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Authentication required.");
        }

        Caregiver caregiver =
                authService.getCaregiverById(caregiverId);

        if (caregiver == null) {

            session.invalidate();

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Authentication required.");
        }

        return ResponseEntity.ok(
                new CaregiverResponse(
                        caregiver.getId(),
                        caregiver.getName(),
                        caregiver.getUsername(),
                        caregiver.getEmail(),
                        caregiver.getPhone()
                )
        );
    }
}
