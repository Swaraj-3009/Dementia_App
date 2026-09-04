-- =========================================================
-- Prompt 19: Cognitive Game Sessions
-- =========================================================

CREATE TABLE IF NOT EXISTS cognitive_game_sessions (

    id BIGINT AUTO_INCREMENT PRIMARY KEY,

    patient_id BIGINT NOT NULL,

    game_type VARCHAR(50) NOT NULL,

    started_at TIMESTAMP NOT NULL,

    completed_at TIMESTAMP NULL,

    difficulty VARCHAR(20) NOT NULL,

    score INT NOT NULL DEFAULT 0,

    accuracy DECIMAL(5,2) NOT NULL DEFAULT 0.00,

    response_time_ms BIGINT NOT NULL DEFAULT 0,

    correct_count INT NOT NULL DEFAULT 0,

    incorrect_count INT NOT NULL DEFAULT 0,

    completion_status VARCHAR(30) NOT NULL DEFAULT 'IN_PROGRESS',

    client_session_id VARCHAR(100) NOT NULL,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_cognitive_game_patient
        FOREIGN KEY (patient_id)
        REFERENCES patients(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CONSTRAINT uq_cognitive_game_client_session
        UNIQUE (client_session_id),

    CONSTRAINT chk_cognitive_game_accuracy
        CHECK (accuracy >= 0.00 AND accuracy <= 100.00),

    CONSTRAINT chk_cognitive_game_score
        CHECK (score >= 0),

    CONSTRAINT chk_cognitive_game_response_time
        CHECK (response_time_ms >= 0),

    CONSTRAINT chk_cognitive_game_correct_count
        CHECK (correct_count >= 0),

    CONSTRAINT chk_cognitive_game_incorrect_count
        CHECK (incorrect_count >= 0)

);

CREATE INDEX idx_cognitive_game_patient
    ON cognitive_game_sessions(patient_id);

CREATE INDEX idx_cognitive_game_type
    ON cognitive_game_sessions(game_type);

CREATE INDEX idx_cognitive_game_created_at
    ON cognitive_game_sessions(created_at);