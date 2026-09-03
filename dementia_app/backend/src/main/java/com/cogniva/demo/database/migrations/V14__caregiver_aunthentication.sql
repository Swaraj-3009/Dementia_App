USE dementia_app;

ALTER TABLE caregivers
    ADD COLUMN username VARCHAR(100) NULL AFTER name,
    ADD COLUMN password_hash VARCHAR(255) NULL AFTER username;

CREATE UNIQUE INDEX uk_caregivers_username
    ON caregivers(username);

UPDATE caregivers
SET username = 'demo_caregiver'
WHERE email = 'demo.caregiver@example.com';

-- BCrypt hash for the local/demo password:
-- Demo@123
UPDATE caregivers
SET password_hash = '$2a$10$7EqJtq98hPqEX7fNZaFWoOe5XxZ1R7f7mQXv8Y6z7HqJ1pG5r8m3K'
WHERE email = 'demo.caregiver@example.com';