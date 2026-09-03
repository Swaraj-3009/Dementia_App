package com.cogniva.demo.model;

import java.time.LocalDateTime;
import java.time.LocalTime;

public class Reminder {

    private Long id;
    private Long patientId;
    private String title;
    private String description;
    private LocalTime reminderTime;
    private String category;
    private String status;
    private Boolean caregiverVisible;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Reminder() {
    }

    public Reminder(
            Long id,
            Long patientId,
            String title,
            String description,
            LocalTime reminderTime,
            String category,
            String status,
            Boolean caregiverVisible,
            LocalDateTime createdAt,
            LocalDateTime updatedAt) {

        this.id = id;
        this.patientId = patientId;
        this.title = title;
        this.description = description;
        this.reminderTime = reminderTime;
        this.category = category;
        this.status = status;
        this.caregiverVisible = caregiverVisible;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalTime getReminderTime() {
        return reminderTime;
    }

    public void setReminderTime(LocalTime reminderTime) {
        this.reminderTime = reminderTime;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Boolean getCaregiverVisible() {
        return caregiverVisible;
    }

    public void setCaregiverVisible(Boolean caregiverVisible) {
        this.caregiverVisible = caregiverVisible;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
