package com.cogniva.demo.model;

import java.time.LocalDateTime;

public class EmergencyEvent {

    private Long id;
    private Long patientId;
    private LocalDateTime eventTimestamp;
    private String status;
    private String description;

    public EmergencyEvent() {
    }

    public EmergencyEvent(
            Long id,
            Long patientId,
            LocalDateTime eventTimestamp,
            String status,
            String description) {
        this.id = id;
        this.patientId = patientId;
        this.eventTimestamp = eventTimestamp;
        this.status = status;
        this.description = description;
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

    public LocalDateTime getEventTimestamp() {
        return eventTimestamp;
    }

    public void setEventTimestamp(LocalDateTime eventTimestamp) {
        this.eventTimestamp = eventTimestamp;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}