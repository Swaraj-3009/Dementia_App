package com.cogniva.demo.service;

import com.cogniva.demo.exception.InvalidReminderCategoryException;
//import com.cogniva.demo.exception.MedicationNotFoundException;
import com.cogniva.demo.exception.PatientReferenceNotFoundException;
import com.cogniva.demo.exception.ReminderNotFoundException;
import com.cogniva.demo.model.Reminder;
import com.cogniva.demo.repository.PatientRepository;
import com.cogniva.demo.repository.ReminderRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

@Service
public class ReminderService {

    private static final Set<String> SUPPORTED_CATEGORIES = Set.of(
            "Medicine",
            "Hydration",
            "Daily activity",
            "Medical appointment"
    );

    private final ReminderRepository reminderRepository;
    private final PatientRepository patientRepository;

    public ReminderService(
            ReminderRepository reminderRepository,
            PatientRepository patientRepository) {

        this.reminderRepository = reminderRepository;
        this.patientRepository = patientRepository;
    }

    public Reminder createReminder(Reminder reminder) {

        validateReminder(reminder);

        if (reminder.getStatus() == null ||
                reminder.getStatus().isBlank()) {

            reminder.setStatus("PENDING");
        }

        return reminderRepository.create(reminder);
    }

    public List<Reminder> getAllReminders() {
        return reminderRepository.findAll();
    }

    public Reminder getReminderById(Long id) {

        return reminderRepository.findById(id)
                .orElseThrow(() ->
                        new ReminderNotFoundException(id));
    }

    public Reminder updateReminder(
            Long id,
            Reminder reminder) {

        Reminder existingReminder =
                reminderRepository.findById(id)
                        .orElseThrow(() ->
                                new ReminderNotFoundException(id));

        validateReminder(reminder);

        if (reminder.getStatus() == null ||
                reminder.getStatus().isBlank()) {

            reminder.setStatus(existingReminder.getStatus());
        }

        reminder.setId(existingReminder.getId());
        reminder.setCreatedAt(existingReminder.getCreatedAt());

        Reminder updatedReminder =
                reminderRepository.update(id, reminder);

        if (updatedReminder == null) {
            throw new ReminderNotFoundException(id);
        }

        return updatedReminder;
    }

    public void deleteReminder(Long id) {

        reminderRepository.findById(id)
                .orElseThrow(() ->
                        new ReminderNotFoundException(id));

        boolean deleted = reminderRepository.delete(id);

        if (!deleted) {
            throw new ReminderNotFoundException(id);
        }
    }

    private void validateReminder(Reminder reminder) {

        validatePatientReference(reminder.getPatientId());
        validateCategory(reminder.getCategory());

        if (reminder.getCaregiverVisible() == null) {
            reminder.setCaregiverVisible(true);
        }
    }

    private void validatePatientReference(Long patientId) {

        if (patientId == null ||
                patientRepository.findById(patientId).isEmpty()) {

            throw new PatientReferenceNotFoundException(patientId);
        }
    }

    private void validateCategory(String category) {

        if (category == null ||
                !SUPPORTED_CATEGORIES.contains(category)) {

            throw new InvalidReminderCategoryException(category);
        }
    }
}
