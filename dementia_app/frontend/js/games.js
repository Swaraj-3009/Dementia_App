/* =========================================================
   MemorySaathi Cognitive Game Engine
   Prompt 19

   Rule-based reusable framework.
   This is NOT machine-learning AI.
   ========================================================= */

const GAME_TYPES = Object.freeze({
    MEMORY: "MEMORY",
    ATTENTION: "ATTENTION",
    DAILY_ROUTINE_RECALL: "DAILY_ROUTINE_RECALL",
    PATTERN_RECOGNITION: "PATTERN_RECOGNITION"
});

const DIFFICULTIES = Object.freeze({
    EASY: "EASY",
    MEDIUM: "MEDIUM",
    HARD: "HARD"
});

const COMPLETION_STATUS = Object.freeze({
    IN_PROGRESS: "IN_PROGRESS",
    COMPLETED: "COMPLETED",
    ABANDONED: "ABANDONED"
});


/* =========================================================
   Game Definitions
   ========================================================= */

const GAME_DEFINITIONS = Object.freeze({

    [GAME_TYPES.MEMORY]: {
        id: GAME_TYPES.MEMORY,
        name: "Memory",
        description:
            "Remember familiar items and select the correct answer."
    },

    [GAME_TYPES.ATTENTION]: {
        id: GAME_TYPES.ATTENTION,
        name: "Attention",
        description:
            "Identify a target while ignoring distractions."
    },

    [GAME_TYPES.DAILY_ROUTINE_RECALL]: {
        id: GAME_TYPES.DAILY_ROUTINE_RECALL,
        name: "Daily Routine Recall",
        description:
            "Remember familiar daily activities and their order."
    },

    [GAME_TYPES.PATTERN_RECOGNITION]: {
        id: GAME_TYPES.PATTERN_RECOGNITION,
        name: "Pattern Recognition",
        description:
            "Recognize simple patterns or familiar objects."
    }
});


/* =========================================================
   Utility
   ========================================================= */

function createClientSessionId() {

    if (
        window.crypto &&
        typeof window.crypto.randomUUID === "function"
    ) {
        return window.crypto.randomUUID();
    }

    return (
        "game-" +
        Date.now() +
        "-" +
        Math.random()
            .toString(36)
            .substring(2, 10)
    );
}


/* =========================================================
   Cognitive Game Engine
   ========================================================= */

class CognitiveGameEngine {

    constructor({
        patientId,
        gameType,
        difficulty = DIFFICULTIES.EASY
    }) {

        if (!patientId) {
            throw new Error(
                "Patient ID is required to start a game."
            );
        }

        if (!GAME_DEFINITIONS[gameType]) {
            throw new Error(
                `Unsupported game type: ${gameType}`
            );
        }

        if (!Object.values(DIFFICULTIES)
            .includes(difficulty)) {

            throw new Error(
                `Unsupported difficulty: ${difficulty}`
            );
        }

        this.patientId = patientId;
        this.gameType = gameType;
        this.difficulty = difficulty;

        this.clientSessionId =
            createClientSessionId();

        this.startedAt = null;
        this.completedAt = null;

        this.score = 0;
        this.correctCount = 0;
        this.incorrectCount = 0;

        this.responseTimeMs = 0;

        this.completionStatus =
            COMPLETION_STATUS.IN_PROGRESS;

        this.answerCount = 0;

        this.started = false;
    }


    /* =====================================================
       Start
       ===================================================== */

    start() {

        if (this.started) {
            return this.getState();
        }

        this.startedAt =
            new Date();

        this.started = true;

        return this.getState();
    }


    /* =====================================================
       Record Answer
       ===================================================== */

    recordAnswer({
        correct,
        responseTimeMs = 0,
        score = null
    }) {

        if (!this.started) {
            throw new Error(
                "Game session has not been started."
            );
        }

        if (this.completionStatus !==
            COMPLETION_STATUS.IN_PROGRESS) {

            throw new Error(
                "Game session is no longer active."
            );
        }

        const isCorrect =
            Boolean(correct);

        const responseTime =
            Number(responseTimeMs);

        if (
            !Number.isFinite(responseTime) ||
            responseTime < 0
        ) {
            throw new Error(
                "Response time must be a non-negative number."
            );
        }

        this.answerCount++;

        this.responseTimeMs +=
            responseTime;

        if (isCorrect) {

            this.correctCount++;

            /*
             * Individual games can provide their own score.
             * If they don't, one correct answer counts as
             * one point in the reusable baseline engine.
             */
            this.score +=
                score === null
                    ? 1
                    : Number(score);

        } else {

            this.incorrectCount++;
        }

        return this.getState();
    }


    /* =====================================================
       Finish
       ===================================================== */

    finish(status = COMPLETION_STATUS.COMPLETED) {

        if (!Object.values(COMPLETION_STATUS)
            .includes(status)) {

            throw new Error(
                `Unsupported completion status: ${status}`
            );
        }

        if (!this.started) {
            throw new Error(
                "Game session has not been started."
            );
        }

        this.completedAt =
            new Date();

        this.completionStatus =
            status;

        return this.getState();
    }


    /* =====================================================
       Accuracy
       ===================================================== */

    getAccuracy() {

        if (this.answerCount === 0) {
            return 0;
        }

        return Number(
            (
                this.correctCount /
                this.answerCount *
                100
            ).toFixed(2)
        );
    }


    /* =====================================================
       API Payload
       ===================================================== */

    getSessionPayload() {

        return {
            patientId: this.patientId,
            gameType: this.gameType,
            difficulty: this.difficulty,
            clientSessionId:
                this.clientSessionId,

            startedAt:
                this.startedAt
                    ? this.startedAt.toISOString()
                    : null,

            completedAt:
                this.completedAt
                    ? this.completedAt.toISOString()
                    : null,

            score: this.score,

            accuracy:
                this.getAccuracy(),

            responseTimeMs:
                this.responseTimeMs,

            correctCount:
                this.correctCount,

            incorrectCount:
                this.incorrectCount,

            completionStatus:
                this.completionStatus
        };
    }


    /* =====================================================
       Current State
       ===================================================== */

    getState() {

        return {
            patientId: this.patientId,
            gameType: this.gameType,
            difficulty: this.difficulty,
            clientSessionId:
                this.clientSessionId,

            startedAt:
                this.startedAt,

            completedAt:
                this.completedAt,

            score: this.score,
            accuracy: this.getAccuracy(),

            responseTimeMs:
                this.responseTimeMs,

            correctCount:
                this.correctCount,

            incorrectCount:
                this.incorrectCount,

            completionStatus:
                this.completionStatus
        };
    }
}


/* =========================================================
   Factory
   ========================================================= */

function createCognitiveGame({
    patientId,
    gameType,
    difficulty = DIFFICULTIES.EASY
}) {

    return new CognitiveGameEngine({
        patientId,
        gameType,
        difficulty
    });
}


/* =========================================================
   Exports
   ========================================================= */

export {
    GAME_TYPES,
    DIFFICULTIES,
    COMPLETION_STATUS,
    GAME_DEFINITIONS,
    CognitiveGameEngine,
    createCognitiveGame,
    createClientSessionId
};