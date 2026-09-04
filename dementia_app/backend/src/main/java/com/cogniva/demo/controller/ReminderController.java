package com.cogniva.demo.controller;

import com.cogniva.demo.exception.InvalidReminderCategoryException;
import com.cogniva.demo.exception.PatientReferenceNotFoundException;
import com.cogniva.demo.exception.ReminderNotFoundException;
import com.cogniva.demo.model.Reminder;
import com.cogniva.demo.service.ReminderService;
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
@RequestMapping("/api/reminders")
@Validated
public class ReminderController {

    private final ReminderService reminderService;
    private final SessionAccessService accessService;

    public ReminderController(
            ReminderService reminderService,
            SessionAccessService accessService) {
        this.reminderService = reminderService;
        this.accessService = accessService;
    }

    @GetMapping
    public ResponseEntity<List<Reminder>> getAllReminders(HttpSession session) {

        return ResponseEntity.ok(
                reminderService.getRemindersForCaregiver(
                        accessService.requireCaregiver(session)
                )
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reminder> getReminderById(
            @PathVariable @Positive Long id, HttpSession session) {

        Reminder reminder = reminderService.getReminderById(id);
        accessService.requirePatientAccess(session, reminder.getPatientId());

        return ResponseEntity.ok(reminder);
    }

    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Reminder>> getForPatient(
            @PathVariable @Positive Long patientId, HttpSession session) {
        accessService.requirePatientAccess(session, patientId);
        return ResponseEntity.ok(reminderService.getRemindersForPatient(patientId));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<Reminder> markCompleted(
            @PathVariable @Positive Long id, HttpSession session) {
        Reminder reminder = reminderService.getReminderById(id);
        accessService.requirePatientAccess(session, reminder.getPatientId());
        return ResponseEntity.ok(reminderService.markCompleted(id));
    }

    @PostMapping
    public ResponseEntity<Reminder> createReminder(
            @Valid @RequestBody Reminder reminder, HttpSession session) {

        accessService.requireCaregiver(session);
        accessService.requirePatientAccess(session, reminder.getPatientId());

        Reminder createdReminder =
                reminderService.createReminder(reminder);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdReminder);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Reminder> updateReminder(
            @PathVariable @Positive Long id,
            @Valid @RequestBody Reminder reminder, HttpSession session) {

        accessService.requireCaregiver(session);
        Reminder existing = reminderService.getReminderById(id);
        accessService.requirePatientAccess(session, existing.getPatientId());
        accessService.requirePatientAccess(session, reminder.getPatientId());

        Reminder updatedReminder =
                reminderService.updateReminder(id, reminder);

        return ResponseEntity.ok(updatedReminder);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReminder(
            @PathVariable @Positive Long id, HttpSession session) {

        accessService.requireCaregiver(session);
        Reminder reminder = reminderService.getReminderById(id);
        accessService.requirePatientAccess(session, reminder.getPatientId());

        reminderService.deleteReminder(id);

        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler(ReminderNotFoundException.class)
    public ResponseEntity<String> handleReminderNotFound(
            ReminderNotFoundException exception) {

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(exception.getMessage());
    }

    @ExceptionHandler(PatientReferenceNotFoundException.class)
    public ResponseEntity<String> handleInvalidPatientReference(
            PatientReferenceNotFoundException exception) {

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(exception.getMessage());
    }

    @ExceptionHandler(InvalidReminderCategoryException.class)
    public ResponseEntity<String> handleInvalidCategory(
            InvalidReminderCategoryException exception) {

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(exception.getMessage());
    }
}
