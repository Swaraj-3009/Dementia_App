package com.cogniva.demo.exception;

public class InvalidReminderCategoryException extends RuntimeException {

    public InvalidReminderCategoryException(String category) {
        super(
                "Invalid reminder category: " + category
                        + ". Supported categories are: Medicine, Hydration, "
                        + "Daily activity, Medical appointment."
        );
    }
}
