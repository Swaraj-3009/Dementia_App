USE dementia_app;

ALTER TABLE patients
    ADD COLUMN username VARCHAR(100) NULL AFTER name,
    ADD COLUMN password_hash VARCHAR(255) NULL AFTER username;

CREATE UNIQUE INDEX uk_patients_username ON patients(username);

-- Local/demo account only. Password: Demo@123
UPDATE patients
SET username = 'demo_patient',
    password_hash = '$2a$10$jywg.PjMTZGoPLImm/Opc.E81l8TYc1BiNI/1ZWBvbR4o1GHEkvlO'
WHERE id = 1;
