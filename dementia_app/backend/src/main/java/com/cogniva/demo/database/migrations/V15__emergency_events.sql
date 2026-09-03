USE dementia_app;

CREATE TABLE IF NOT EXISTS emergency_events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    event_timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(30) NOT NULL DEFAULT 'TRIGGERED',
    description VARCHAR(255) NOT NULL,

    CONSTRAINT fk_emergency_events_patient
        FOREIGN KEY (patient_id)
        REFERENCES patients(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    INDEX idx_emergency_events_patient_id (patient_id),
    INDEX idx_emergency_events_timestamp (event_timestamp),
    INDEX idx_emergency_events_status (status)
);