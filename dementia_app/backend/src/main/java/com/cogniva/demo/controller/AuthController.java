package com.cogniva.demo.controller;

import com.cogniva.demo.dto.CaregiverResponse;
import com.cogniva.demo.dto.LoginRequest;
import com.cogniva.demo.model.Caregiver;
import com.cogniva.demo.service.AuthService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final String CAREGIVER_ID =
            "CAREGIVER_ID";

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest request,
            HttpSession session) {

        Caregiver caregiver =
                authService.authenticate(
                        request.getIdentifier(),
                        request.getPassword()
                );

        if (caregiver == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid username/email or password.");
        }

        session.setAttribute(
                CAREGIVER_ID,
                caregiver.getId()
        );

        return ResponseEntity.ok(
                toResponse(caregiver)
        );
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            HttpSession session) {

        session.invalidate();

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/me")
    public ResponseEntity<?> currentCaregiver(
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
                toResponse(caregiver)
        );
    }

    private CaregiverResponse toResponse(
            Caregiver caregiver) {

        return new CaregiverResponse(
                caregiver.getId(),
                caregiver.getName(),
                caregiver.getUsername(),
                caregiver.getEmail(),
                caregiver.getPhone()
        );
    }
}
