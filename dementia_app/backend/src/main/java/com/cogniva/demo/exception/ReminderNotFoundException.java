package com.cogniva.demo.exception;

public class ReminderNotFoundException extends RuntimeException {

    public ReminderNotFoundException(Long reminderId) {
        super("Reminder not found with ID: " + reminderId);
    }
}
