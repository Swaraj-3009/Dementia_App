-- ============================================================
-- SIH 2026 Dementia-Care Web Application
-- Baseline MySQL Schema
-- ============================================================

CREATE DATABASE IF NOT EXISTS dementia_app;

USE dementia_app;

-- ============================================================
-- 1. CAREGIVERS
-- ============================================================

CREATE TABLE caregivers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255),
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT uk_caregivers_email UNIQUE (email)
);


-- ============================================================
-- 2. PATIENTS
-- ============================================================

CREATE TABLE patients (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    caregiver_id BIGINT,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(100) UNIQUE,
    password_hash VARCHAR(255),
    date_of_birth DATE,
    phone VARCHAR(20),
    address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_patients_caregiver
        FOREIGN KEY (caregiver_id)
        REFERENCES caregivers(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE,

    INDEX idx_patients_caregiver_id (caregiver_id)
);


-- ============================================================
-- 3. MEDICATIONS
-- ============================================================

CREATE TABLE medications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    name VARCHAR(150) NOT NULL,
    dosage VARCHAR(100),
    frequency VARCHAR(100),
    instructions VARCHAR(255),
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_medications_patient
        FOREIGN KEY (patient_id)
        REFERENCES patients(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    INDEX idx_medications_patient_id (patient_id)
);


-- ============================================================
-- 4. REMINDERS
-- ============================================================

CREATE TABLE reminders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description VARCHAR(500),
    reminder_time TIME NOT NULL,
    category VARCHAR(50) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    caregiver_visible BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_reminders_patient
        FOREIGN KEY (patient_id)
        REFERENCES patients(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    INDEX idx_reminders_patient_id (patient_id),
    INDEX idx_reminders_category (category),
    INDEX idx_reminders_status (status),
    INDEX idx_reminders_patient_time (patient_id, reminder_time)
);

CREATE TABLE emergency_contacts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    relationship VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_emergency_contacts_patient FOREIGN KEY (patient_id)
        REFERENCES patients(id) ON DELETE CASCADE ON UPDATE CASCADE
);
 
CREATE TABLE emergency_events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    patient_id BIGINT NOT NULL,
    event_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(30) NOT NULL DEFAULT 'TRIGGERED',
    description VARCHAR(500) NOT NULL,
    CONSTRAINT fk_emergency_events_patient FOREIGN KEY (patient_id)
        REFERENCES patients(id) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX idx_emergency_events_patient_timestamp (patient_id, event_timestamp)
);


-- ============================================================
-- SAMPLE DEMO DATA
-- ============================================================

-- Caregiver
INSERT INTO caregivers (name, username, password_hash, email, phone)
VALUES
    (
        'Demo Caregiver',
        'demo_caregiver',
        '$2a$10$jywg.PjMTZGoPLImm/Opc.E81l8TYc1BiNI/1ZWBvbR4o1GHEkvlO',
        'demo.caregiver@example.com',
        '9000000000'
    );


-- Patient associated with the caregiver above
INSERT INTO patients (
    caregiver_id,
    name,
    date_of_birth,
    phone,
    address
)
VALUES
    (
        1,
        'Demo Patient',
        '1955-06-15',
        '9000000001',
        'Demo Address'
    );
 
-- Local/demo patient credentials. Password: Demo@123
UPDATE patients
SET username = 'demo_patient',
    password_hash = '$2a$10$jywg.PjMTZGoPLImm/Opc.E81l8TYc1BiNI/1ZWBvbR4o1GHEkvlO'
WHERE id = 1;
 
 
-- Medication for the demo patient
INSERT INTO medications (
    patient_id,
    name,
    dosage,
    frequency,
    instructions,
    start_date,
    end_date
)
VALUES
    (
        1,
        'Demo Medication',
        '1 tablet',
        'Once daily',
        'Take after breakfast',
        '2026-09-01',
        NULL
    );


-- Reminders for the demo patient
INSERT INTO reminders (
    patient_id,
    title,
    description,
    reminder_time,
    category,
    status,
    caregiver_visible
)
VALUES
    (
        1,
        'Take medicine',
        'Take the prescribed medicine after breakfast.',
        '09:00:00',
        'Medicine',
        'PENDING',
        TRUE
    ),
    (
        1,
        'Drink water',
        'Drink a glass of water.',
        '11:00:00',
        'Hydration',
        'PENDING',
        TRUE
    ),
    (
        1,
        'Daily walk',
        'Go for a short daily walk.',
        '17:00:00',
        'Daily activity',
        'PENDING',
        TRUE
    ),
    (
        1,
        'Medical appointment',
        'Attend the scheduled medical appointment.',
        '10:30:00',
        'Medical appointment',
        'PENDING',
        TRUE
    );
 
INSERT INTO emergency_contacts (patient_id, name, phone, relationship)
VALUES (1, 'Demo Emergency Contact', '9000000002', 'Family');
 