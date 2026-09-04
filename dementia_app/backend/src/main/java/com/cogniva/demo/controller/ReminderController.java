package com.cogniva.demo.controller;

import com.cogniva.demo.exception.InvalidReminderCategoryException;
import com.cogniva.demo.exception.PatientReferenceNotFoundException;
import com.cogniva.demo.exception.ReminderNotFoundException;
import com.cogniva.demo.model.Reminder;
import com.cogniva.demo.service.ReminderService;
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

    public ReminderController(ReminderService reminderService) {
        this.reminderService = reminderService;
    }

    @GetMapping
    public ResponseEntity<List<Reminder>> getAllReminders() {

        return ResponseEntity.ok(
                reminderService.getAllReminders()
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reminder> getReminderById(
            @PathVariable @Positive Long id) {

        return ResponseEntity.ok(
                reminderService.getReminderById(id)
        );
    }

    @PostMapping
    public ResponseEntity<Reminder> createReminder(
            @Valid @RequestBody Reminder reminder) {

        Reminder createdReminder =
                reminderService.createReminder(reminder);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdReminder);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Reminder> updateReminder(
            @PathVariable @Positive Long id,
            @Valid @RequestBody Reminder reminder) {

        Reminder updatedReminder =
                reminderService.updateReminder(id, reminder);

        return ResponseEntity.ok(updatedReminder);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReminder(
            @PathVariable @Positive Long id) {

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
