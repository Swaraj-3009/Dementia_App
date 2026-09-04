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

/* =========================================================
   Memory Game
   Prompt 20

   Uses the existing CognitiveGameEngine and the existing
   cognitive-game session API.

   This is an activity/game only.
   It is NOT a diagnostic assessment.
   ========================================================= */

const MEMORY_GAME_CONFIG = Object.freeze({

    [DIFFICULTIES.EASY]: {
        itemCount: 3,
        displayTimeMs: 4000,
        pointsPerCorrect: 10
    },

    [DIFFICULTIES.MEDIUM]: {
        itemCount: 4,
        displayTimeMs: 3500,
        pointsPerCorrect: 15
    },

    [DIFFICULTIES.HARD]: {
        itemCount: 5,
        displayTimeMs: 3000,
        pointsPerCorrect: 20
    }
});


const MEMORY_ITEMS = Object.freeze([
    {
        id: "apple",
        label: "Apple",
        symbol: "🍎"
    },
    {
        id: "cup",
        label: "Cup",
        symbol: "☕"
    },
    {
        id: "book",
        label: "Book",
        symbol: "📖"
    },
    {
        id: "flower",
        label: "Flower",
        symbol: "🌼"
    },
    {
        id: "house",
        label: "House",
        symbol: "🏠"
    },
    {
        id: "water",
        label: "Water",
        symbol: "💧"
    },
    {
        id: "sun",
        label: "Sun",
        symbol: "☀️"
    },
    {
        id: "clock",
        label: "Clock",
        symbol: "🕐"
    }
]);


/* =========================================================
   Memory Game State
   ========================================================= */

let memoryGameState = null;


/* =========================================================
   Utility
   ========================================================= */

function shuffleItems(items) {

    const copy = [...items];

    for (let i = copy.length - 1; i > 0; i--) {

        const randomIndex =
            Math.floor(Math.random() * (i + 1));

        [
            copy[i],
            copy[randomIndex]
        ] = [
            copy[randomIndex],
            copy[i]
        ];
    }

    return copy;
}


function getMemoryConfig(difficulty) {

    const config =
        MEMORY_GAME_CONFIG[difficulty];

    if (!config) {
        throw new Error(
            `Unsupported memory difficulty: ${difficulty}`
        );
    }

    return config;
}


/* =========================================================
   Initialize Memory Game
   ========================================================= */

function initializeMemoryGame(patientId) {

    const container =
        document.getElementById("memory-game");

    if (!container) {
        return;
    }

    if (!patientId) {

        container.innerHTML = `
            <div class="error-state">
                A patient must be selected before starting
                the Memory activity.
            </div>
        `;

        return;
    }

    renderMemorySetup(container, patientId);
}


/* =========================================================
   Setup Screen
   ========================================================= */

function renderMemorySetup(
    container,
    patientId
) {

    container.innerHTML = `
        <div class="memory-game-panel">

            <div class="memory-introduction">

                <h3>Memory Activity</h3>

                <p>
                    Look carefully at the familiar items.
                    They will disappear after a short time.
                    Then select the items you remember.
                </p>

                <p class="memory-disclaimer">
                    This is a simple memory activity.
                    It is not a medical or diagnostic test.
                </p>

            </div>


            <div class="memory-difficulty">

                <label for="memory-difficulty">
                    Choose difficulty
                </label>

                <select
                    id="memory-difficulty"
                    class="memory-select"
                >
                    <option value="EASY">
                        Easy
                    </option>

                    <option value="MEDIUM">
                        Medium
                    </option>

                    <option value="HARD">
                        Hard
                    </option>
                </select>

            </div>


            <button
                id="memory-start-button"
                class="memory-primary-button"
                type="button"
            >
                Start Memory Activity
            </button>


            <div
                id="memory-status"
                class="memory-status"
                aria-live="polite"
            >
                Ready to begin.
            </div>

        </div>
    `;


    const startButton =
        document.getElementById(
            "memory-start-button"
        );

    const difficultySelect =
        document.getElementById(
            "memory-difficulty"
        );


    startButton.addEventListener(
        "click",
        () => {

            startMemoryGame(
                patientId,
                difficultySelect.value
            );
        }
    );
}


/* =========================================================
   Start Game
   ========================================================= */

async function startMemoryGame(
    patientId,
    difficulty
) {

    const container =
        document.getElementById("memory-game");

    if (!container) {
        return;
    }

    try {

        const config =
            getMemoryConfig(difficulty);


        /*
         * Reuse the existing Prompt 19 engine.
         */
        const engine =
            createCognitiveGame({
                patientId,
                gameType: GAME_TYPES.MEMORY,
                difficulty
            });


        engine.start();


        /*
         * Start the server-side session using the
         * existing Prompt 19 API.
         */
        const api =
            await import("./api.js");


        const serverSession =
            await api.startCognitiveGameSession(
                engine.getSessionPayload()
            );


        /*
         * Store only the information needed by this
         * frontend game instance.
         */
        memoryGameState = {

            patientId,

            difficulty,

            config,

            engine,

            serverSessionId:
                serverSession.id,

            selectedItems: [],

            targetItems: [],

            questionStartedAt: null,

            finished: false,

            saving: false
        };


        /*
         * Generate a fresh set of familiar items.
         */
        memoryGameState.targetItems =
            shuffleItems(MEMORY_ITEMS)
                .slice(0, config.itemCount);


        renderMemoryShowingPhase();

        setTimeout(
            () => {

                if (
                    memoryGameState &&
                    !memoryGameState.finished
                ) {
                    renderMemoryRecallPhase();
                }

            },
            config.displayTimeMs
        );

    } catch (error) {

        console.error(
            "Unable to start Memory activity:",
            error
        );

        container.innerHTML = `
            <div class="error-state">

                <h3>
                    Memory activity could not start
                </h3>

                <p>
                    ${escapeMemoryHtml(
                        error.message ||
                        "Unable to start the activity."
                    )}
                </p>

                <button
                    type="button"
                    id="memory-retry-button"
                    class="memory-primary-button"
                >
                    Try Again
                </button>

            </div>
        `;


        const retryButton =
            document.getElementById(
                "memory-retry-button"
            );


        if (retryButton) {

            retryButton.addEventListener(
                "click",
                () => {
                    initializeMemoryGame(patientId);
                }
            );
        }
    }
}


/* =========================================================
   Showing Phase
   ========================================================= */

function renderMemoryShowingPhase() {

    const container =
        document.getElementById("memory-game");

    if (!container || !memoryGameState) {
        return;
    }


    const items =
        memoryGameState.targetItems;


    container.innerHTML = `

        <div class="memory-game-panel">

            <div class="memory-progress">

                <span>
                    Step 1 of 2
                </span>

                <strong>
                    Look carefully
                </strong>

            </div>


            <h3>
                Remember these items
            </h3>

            <p class="memory-instruction">
                Look at the items carefully.
                They will disappear soon.
            </p>


            <div
                class="memory-items-grid"
                aria-label="Items to remember"
            >

                ${items.map(item => `

                    <div class="memory-item memory-item-visible">

                        <span
                            class="memory-item-symbol"
                            aria-hidden="true"
                        >
                            ${item.symbol}
                        </span>

                        <span class="memory-item-label">
                            ${escapeMemoryHtml(item.label)}
                        </span>

                    </div>

                `).join("")}

            </div>


            <div
                class="memory-countdown"
                id="memory-countdown"
            >
                Remember ${items.length} items.
            </div>

        </div>
    `;


    startMemoryCountdown(
        memoryGameState.config.displayTimeMs
    );
}


/* =========================================================
   Countdown
   ========================================================= */

function startMemoryCountdown(
    durationMs
) {

    const countdown =
        document.getElementById(
            "memory-countdown"
        );

    if (!countdown) {
        return;
    }


    const startedAt =
        Date.now();


    const timer =
        setInterval(
            () => {

                if (!memoryGameState ||
                    memoryGameState.finished) {

                    clearInterval(timer);

                    return;
                }


                const elapsed =
                    Date.now() - startedAt;


                const remaining =
                    Math.max(
                        0,
                        durationMs - elapsed
                    );


                const seconds =
                    Math.ceil(
                        remaining / 1000
                    );


                if (seconds <= 0) {

                    countdown.textContent =
                        "Now choose the items you remember.";

                    clearInterval(timer);

                } else {

                    countdown.textContent =
                        `You have ${seconds} seconds to remember them.`;
                }

            },
            250
        );
}


/* =========================================================
   Recall Phase
   ========================================================= */

function renderMemoryRecallPhase() {

    const container =
        document.getElementById("memory-game");

    if (!container || !memoryGameState) {
        return;
    }


    memoryGameState.questionStartedAt =
        Date.now();


    memoryGameState.selectedItems = [];


    /*
     * Present the target items mixed with distractors.
     */
    const distractors =
        shuffleItems(
            MEMORY_ITEMS.filter(
                item =>
                    !memoryGameState.targetItems.some(
                        target =>
                            target.id === item.id
                    )
            )
        ).slice(
            0,
            memoryGameState.config.itemCount
        );


    const choices =
        shuffleItems([
            ...memoryGameState.targetItems,
            ...distractors
        ]);


    container.innerHTML = `

        <div class="memory-game-panel">

            <div class="memory-progress">

                <span>
                    Step 2 of 2
                </span>

                <strong>
                    Recall
                </strong>

            </div>


            <h3>
                Which items did you see?
            </h3>

            <p class="memory-instruction">
                Select all the items you remember
                seeing.
            </p>


            <div
                class="memory-items-grid"
                id="memory-choice-grid"
            >

                ${choices.map(item => `

                    <button
                        type="button"
                        class="memory-item memory-choice-button"
                        data-memory-item="${escapeMemoryHtml(item.id)}"
                        aria-pressed="false"
                    >

                        <span
                            class="memory-item-symbol"
                            aria-hidden="true"
                        >
                            ${item.symbol}
                        </span>

                        <span class="memory-item-label">
                            ${escapeMemoryHtml(item.label)}
                        </span>

                    </button>

                `).join("")}

            </div>


            <div class="memory-actions">

                <button
                    type="button"
                    id="memory-submit-button"
                    class="memory-primary-button"
                >
                    Check My Answers
                </button>

            </div>


            <div
                id="memory-status"
                class="memory-status"
                aria-live="polite"
            >
                Select the items you remember.
            </div>

        </div>
    `;


    const choiceButtons =
        document.querySelectorAll(
            ".memory-choice-button"
        );


    choiceButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    toggleMemoryChoice(
                        button
                    );
                }
            );
        }
    );


    const submitButton =
        document.getElementById(
            "memory-submit-button"
        );


    if (submitButton) {

        submitButton.addEventListener(
            "click",
            completeMemoryGame
        );
    }
}


/* =========================================================
   Toggle Answer
   ========================================================= */

function toggleMemoryChoice(button) {

    if (!memoryGameState ||
        memoryGameState.finished) {

        return;
    }


    const itemId =
        button.dataset.memoryItem;


    const selectedIndex =
        memoryGameState.selectedItems
            .indexOf(itemId);


    if (selectedIndex === -1) {

        memoryGameState.selectedItems.push(
            itemId
        );

        button.classList.add(
            "memory-item-selected"
        );

        button.setAttribute(
            "aria-pressed",
            "true"
        );

    } else {

        memoryGameState.selectedItems.splice(
            selectedIndex,
            1
        );

        button.classList.remove(
            "memory-item-selected"
        );

        button.setAttribute(
            "aria-pressed",
            "false"
        );
    }
}


/* =========================================================
   Complete Game
   ========================================================= */

async function completeMemoryGame() {

    if (!memoryGameState ||
        memoryGameState.finished ||
        memoryGameState.saving) {

        return;
    }


    memoryGameState.saving = true;


    const submitButton =
        document.getElementById(
            "memory-submit-button"
        );


    if (submitButton) {
        submitButton.disabled = true;
    }


    try {

        const responseTimeMs =
            Math.max(
                0,
                Date.now() -
                memoryGameState.questionStartedAt
            );


        const targetIds =
            memoryGameState.targetItems
                .map(item => item.id);


        const selectedIds =
            memoryGameState.selectedItems;


        /*
         * A memory activity is treated as one recall
         * question. It is correct only when the complete
         * remembered set matches the target set.
         */
        const correct =
            targetIds.length === selectedIds.length &&
            targetIds.every(
                id => selectedIds.includes(id)
            );


        const score =
            correct
                ? memoryGameState.config.pointsPerCorrect
                : 0;


        /*
         * Use the reusable Prompt 19 engine.
         */
        memoryGameState.engine.recordAnswer({
            correct,
            responseTimeMs,
            score
        });


        memoryGameState.engine.finish(
            COMPLETION_STATUS.COMPLETED
        );


        const sessionPayload =
            memoryGameState.engine.getSessionPayload();


        const api =
            await import("./api.js");


        /*
         * Existing PUT endpoint.
         * This updates the already-created session.
         */
        const savedSession =
            await api.saveCognitiveGameSession(
                memoryGameState.serverSessionId,
                sessionPayload
            );


        memoryGameState.finished = true;


        renderMemoryResult(
            savedSession,
            correct
        );


    } catch (error) {

        console.error(
            "Unable to save Memory activity:",
            error
        );


        memoryGameState.saving = false;


        if (submitButton) {
            submitButton.disabled = false;
        }


        const status =
            document.getElementById(
                "memory-status"
            );


        if (status) {

            status.textContent =
                "The result could not be saved. " +
                "Please try again.";

            status.className =
                "memory-status memory-status-error";
        }
    }
}


/* =========================================================
   Result Screen
   ========================================================= */

function renderMemoryResult(
    savedSession,
    correct
) {

    const container =
        document.getElementById("memory-game");

    if (!container) {
        return;
    }


    const accuracy =
        Number(
            savedSession?.accuracy ?? 0
        );


    const score =
        Number(
            savedSession?.score ?? 0
        );


    const responseTime =
        Number(
            savedSession?.responseTimeMs ?? 0
        );


    const correctCount =
        Number(
            savedSession?.correctCount ?? 0
        );


    const incorrectCount =
        Number(
            savedSession?.incorrectCount ?? 0
        );


    const message =
        correct
            ? "Well done! You remembered all the items."
            : "Good try! The activity is complete.";


    container.innerHTML = `

        <div class="memory-game-panel memory-result-panel">

            <div class="memory-result-icon"
                 aria-hidden="true">
                ${correct ? "✓" : "✓"}
            </div>


            <h3>
                Memory Activity Complete
            </h3>


            <p class="memory-result-message">
                ${message}
            </p>


            <div class="memory-results-grid">

                <div class="memory-result-card">

                    <span>
                        Score
                    </span>

                    <strong>
                        ${score}
                    </strong>

                </div>


                <div class="memory-result-card">

                    <span>
                        Accuracy
                    </span>

                    <strong>
                        ${accuracy}%
                    </strong>

                </div>


                <div class="memory-result-card">

                    <span>
                        Correct
                    </span>

                    <strong>
                        ${correctCount}
                    </strong>

                </div>


                <div class="memory-result-card">

                    <span>
                        Incorrect
                    </span>

                    <strong>
                        ${incorrectCount}
                    </strong>

                </div>


                <div class="memory-result-card">

                    <span>
                        Response time
                    </span>

                    <strong>
                        ${formatMemoryResponseTime(
                            responseTime
                        )}
                    </strong>

                </div>


                <div class="memory-result-card">

                    <span>
                        Difficulty
                    </span>

                    <strong>
                        ${escapeMemoryHtml(
                            savedSession?.difficulty ||
                            memoryGameState?.difficulty ||
                            "UNKNOWN"
                        )}
                    </strong>

                </div>

            </div>


            <p class="memory-result-note">
                This result records activity in the
                application. It is not a medical diagnosis
                or clinical assessment.
            </p>


            <button
                type="button"
                id="memory-play-again-button"
                class="memory-primary-button"
            >
                Play Again
            </button>

        </div>
    `;


    const playAgainButton =
        document.getElementById(
            "memory-play-again-button"
        );


    if (playAgainButton) {

        const patientId =
            memoryGameState.patientId;


        playAgainButton.addEventListener(
            "click",
            () => {

                memoryGameState = null;

                initializeMemoryGame(
                    patientId
                );
            }
        );
    }
}


/* =========================================================
   Response Time Formatting
   ========================================================= */

function formatMemoryResponseTime(
    responseTimeMs
) {

    const seconds =
        responseTimeMs / 1000;


    return `${seconds.toFixed(1)}s`;
}


/* =========================================================
   HTML Safety
   ========================================================= */

function escapeMemoryHtml(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================================
   Memory Game Export
   ========================================================= */

export {
    initializeMemoryGame
};

const ROUTINE_GAME_CONFIG = {
    EASY: {
        sequenceLength: 3,
        rounds: 3,
        pointsPerCorrect: 10
    },
    MEDIUM: {
        sequenceLength: 4,
        rounds: 4,
        pointsPerCorrect: 15
    },
    HARD: {
        sequenceLength: 5,
        rounds: 5,
        pointsPerCorrect: 20
    }
};

const ROUTINE_ACTIVITIES = [
    { id: "wake", label: "Wake up", symbol: "🌅" },
    { id: "water", label: "Drink water", symbol: "💧" },
    { id: "medicine", label: "Take medicine", symbol: "💊" },
    { id: "eat", label: "Eat a meal", symbol: "🍽️" },
    { id: "walk", label: "Go for a walk", symbol: "🚶" },
    { id: "appointment", label: "Attend an appointment", symbol: "📅" }
];

let routineGameState = null;

function getRoutineConfig(difficulty) {
    const normalized = String(difficulty || "EASY").toUpperCase();
    return ROUTINE_GAME_CONFIG[normalized] || ROUTINE_GAME_CONFIG.EASY;
}

function shuffleRoutineItems(items) {
    const result = [...items];

    for (let i = result.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
}

function createRoutineRound(sequenceLength) {
    const sequence = ROUTINE_ACTIVITIES.slice(0, sequenceLength);

    return {
        sequence,
        choices: shuffleRoutineItems(sequence),
        selected: [],
        questionStartedAt: Date.now()
    };
}

function initializeDailyRoutineRecallGame(patientId) {
    const container = document.getElementById("routine-recall-game");

    if (!container) {
        return;
    }

    container.innerHTML = `
        <div class="routine-game">
            <p class="routine-instructions">
                Put the daily activities in the correct order.
            </p>

            <label for="routine-difficulty">
                Difficulty
            </label>

            <select id="routine-difficulty" class="routine-difficulty">
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
            </select>

            <button
                type="button"
                id="routine-start-button"
                class="routine-primary-button">
                Start activity
            </button>

            <p class="routine-disclaimer">
                This is a simple memory activity, not a diagnostic assessment.
            </p>

            <div id="routine-round-area"></div>
        </div>
    `;

    document
        .getElementById("routine-start-button")
        .addEventListener("click", () => {
            const difficulty =
                document.getElementById("routine-difficulty").value;

            startDailyRoutineRecallGame(patientId, difficulty);
        });
}

async function startDailyRoutineRecallGame(patientId, difficulty) {
    const container = document.getElementById("routine-recall-game");

    if (!container) {
        return;
    }

    const config = getRoutineConfig(difficulty);

    try {
        const engine = createCognitiveGame({
            patientId,
            gameType: GAME_TYPES.DAILY_ROUTINE_RECALL,
            difficulty
        });

        engine.start();

        const { startCognitiveGameSession } = await import("./api.js");

        const session = await startCognitiveGameSession(
            engine.getSessionPayload()
        );

        routineGameState = {
            patientId,
            difficulty,
            config,
            engine,
            serverSessionId: session.id,
            currentRound: 0,
            finished: false,
            saving: false,
            round: createRoutineRound(config.sequenceLength)
        };

        renderRoutineRound();
    } catch (error) {
        console.error("Unable to start routine recall game:", error);

        container.innerHTML = `
            <div class="routine-game">
                <p class="info-note">
                    The routine activity could not be started.
                </p>
            </div>
        `;
    }
}

function renderRoutineRound() {
    const state = routineGameState;
    const area = document.getElementById("routine-round-area");

    if (!state || !area) {
        return;
    }

    const { sequence, choices } = state.round;

    area.innerHTML = `
        <div class="routine-progress">
            Round ${state.currentRound + 1} of ${state.config.rounds}
        </div>

        <h4 class="routine-question">
            Tap the activities in the order they happen.
        </h4>

        <div
            class="routine-selected"
            aria-live="polite"
            id="routine-selected">
            Select the first activity.
        </div>

        <div class="routine-choice-grid">
            ${choices.map((activity) => `
                <button
                    type="button"
                    class="routine-choice"
                    data-activity-id="${activity.id}"
                    aria-label="${escapeRoutineHtml(activity.label)}">
                    <span class="routine-symbol" aria-hidden="true">
                        ${activity.symbol}
                    </span>
                    <span>${escapeRoutineHtml(activity.label)}</span>
                </button>
            `).join("")}
        </div>

        <button
            type="button"
            id="routine-check-button"
            class="routine-primary-button"
            disabled>
            Check order
        </button>
    `;

    area.querySelectorAll(".routine-choice").forEach((button) => {
        button.addEventListener("click", () => {
            selectRoutineActivity(button.dataset.activityId);
        });
    });

    document
        .getElementById("routine-check-button")
        .addEventListener("click", checkRoutineAnswer);
}

function selectRoutineActivity(activityId) {
    const state = routineGameState;

    if (!state || state.finished) {
        return;
    }

    if (state.round.selected.includes(activityId)) {
        return;
    }

    state.round.selected.push(activityId);

    const selectedElement = document.getElementById("routine-selected");
    const checkButton = document.getElementById("routine-check-button");

    if (selectedElement) {
        const labels = state.round.selected.map((id) => {
            const activity = ROUTINE_ACTIVITIES.find(
                (item) => item.id === id
            );

            return activity ? activity.label : "";
        });

        selectedElement.textContent = labels.join(" → ");
    }

    const buttons = document.querySelectorAll(".routine-choice");

    buttons.forEach((button) => {
        if (button.dataset.activityId === activityId) {
            button.disabled = true;
            button.classList.add("selected");
        }
    });

    if (checkButton) {
        checkButton.disabled =
            state.round.selected.length !== state.round.sequence.length;
    }
}

async function checkRoutineAnswer() {
    const state = routineGameState;

    if (!state || state.finished || state.saving) {
        return;
    }

    const expected = state.round.sequence.map((item) => item.id);
    const selected = state.round.selected;

    const correct =
        expected.length === selected.length &&
        expected.every((id, index) => id === selected[index]);

    const responseTimeMs =
        Math.max(0, Date.now() - state.round.questionStartedAt);

    state.engine.recordAnswer({
        correct,
        responseTimeMs,
        score: correct ? state.config.pointsPerCorrect : 0
    });

    state.currentRound += 1;

    if (state.currentRound >= state.config.rounds) {
        await finishRoutineGame();
        return;
    }

    state.round = createRoutineRound(state.config.sequenceLength);

    renderRoutineFeedback(correct);
}

function renderRoutineFeedback(correct) {
    const area = document.getElementById("routine-round-area");

    if (!area) {
        return;
    }

    area.innerHTML = `
        <div class="routine-feedback">
            <h4>${correct ? "Correct!" : "Good try!"}</h4>

            <p>
                ${correct
                    ? "That is the correct order."
                    : "Let's continue with the next sequence."}
            </p>

            <button
                type="button"
                id="routine-next-button"
                class="routine-primary-button">
                Next
            </button>
        </div>
    `;

    document
        .getElementById("routine-next-button")
        .addEventListener("click", renderRoutineRound);
}

async function finishRoutineGame() {
    const state = routineGameState;

    if (!state || state.finished || state.saving) {
        return;
    }

    state.saving = true;

    try {
        state.engine.finish(COMPLETION_STATUS.COMPLETED);

        const payload = state.engine.getSessionPayload();

        const { saveCognitiveGameSession } = await import("./api.js");

        await saveCognitiveGameSession(
            state.serverSessionId,
            payload
        );

        state.finished = true;

        renderRoutineResult();
    } catch (error) {
        console.error("Unable to save routine recall session:", error);

        state.saving = false;

        const area = document.getElementById("routine-round-area");

        if (area) {
            area.innerHTML = `
                <div class="routine-feedback">
                    <h4>Unable to save the result</h4>
                    <p>Please try the activity again.</p>
                </div>
            `;
        }
    }
}

function renderRoutineResult() {
    const state = routineGameState;
    const area = document.getElementById("routine-round-area");

    if (!state || !area) {
        return;
    }

    const result = state.engine.getState();

    area.innerHTML = `
        <div class="routine-result">
            <h4>Activity complete</h4>

            <p><strong>Score:</strong> ${result.score}</p>
            <p><strong>Accuracy:</strong> ${result.accuracy}%</p>
            <p><strong>Correct:</strong> ${result.correctCount}</p>
            <p><strong>Incorrect:</strong> ${result.incorrectCount}</p>
            <p><strong>Response time:</strong>
                ${formatRoutineResponseTime(result.responseTimeMs)}
            </p>
            <p><strong>Difficulty:</strong> ${state.difficulty}</p>

            <p class="routine-disclaimer">
                This activity records game performance only. It is not a
                diagnostic assessment.
            </p>

            <button
                type="button"
                id="routine-replay-button"
                class="routine-primary-button">
                Play again
            </button>
        </div>
    `;

    document
        .getElementById("routine-replay-button")
        .addEventListener("click", () => {
            initializeDailyRoutineRecallGame(state.patientId);
        });
}

function formatRoutineResponseTime(responseTimeMs) {
    const seconds = Math.round((responseTimeMs || 0) / 100) / 10;
    return `${seconds} seconds`;
}

function escapeRoutineHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

export {
    createCognitiveGame,
    createClientSessionId,
    initializeMemoryGame,
    initializeAttentionGame,
    initializeDailyRoutineRecallGame
}


const PATTERN_GAME_CONFIG = {
    EASY: {
        choices: 4,
        rounds: 3,
        pointsPerCorrect: 10
    },
    MEDIUM: {
        choices: 6,
        rounds: 4,
        pointsPerCorrect: 15
    },
    HARD: {
        choices: 8,
        rounds: 5,
        pointsPerCorrect: 20
    }
};

const PATTERN_OBJECTS = [
    { id: "apple", label: "Apple", symbol: "🍎", category: "food" },
    { id: "cup", label: "Cup", symbol: "☕", category: "household" },
    { id: "book", label: "Book", symbol: "📖", category: "learning" },
    { id: "flower", label: "Flower", symbol: "🌼", category: "nature" },
    { id: "house", label: "House", symbol: "🏠", category: "place" },
    { id: "water", label: "Water", symbol: "💧", category: "daily" },
    { id: "sun", label: "Sun", symbol: "☀️", category: "nature" },
    { id: "clock", label: "Clock", symbol: "🕐", category: "time" }
];

let patternGameState = null;

function getPatternConfig(difficulty) {
    const normalized = String(difficulty || "EASY").toUpperCase();

    return PATTERN_GAME_CONFIG[normalized] ||
        PATTERN_GAME_CONFIG.EASY;
}

function shufflePatternItems(items) {
    const result = [...items];

    for (let i = result.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));

        [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
}

function createPatternRound(choiceCount) {
    const target =
        PATTERN_OBJECTS[
            Math.floor(Math.random() * PATTERN_OBJECTS.length)
        ];

    const distractors = shufflePatternItems(
        PATTERN_OBJECTS.filter((item) => item.id !== target.id)
    ).slice(0, choiceCount - 1);

    return {
        target,
        choices: shufflePatternItems([
            target,
            ...distractors
        ]),
        questionStartedAt: Date.now()
    };
}

function initializePatternRecognitionGame(patientId) {
    const container = document.getElementById("pattern-recognition-game");

    if (!container) {
        return;
    }

    container.innerHTML = `
        <div class="pattern-game">
            <p class="pattern-instructions">
                Find the object that matches the target.
            </p>

            <label for="pattern-difficulty">
                Difficulty
            </label>

            <select
                id="pattern-difficulty"
                class="pattern-difficulty">
                <option value="EASY">Easy</option>
                <option value="MEDIUM">Medium</option>
                <option value="HARD">Hard</option>
            </select>

            <button
                type="button"
                id="pattern-start-button"
                class="pattern-primary-button">
                Start activity
            </button>

            <p class="pattern-disclaimer">
                This is a simple activity, not a diagnostic assessment.
            </p>

            <div id="pattern-round-area"></div>
        </div>
    `;

    document
        .getElementById("pattern-start-button")
        .addEventListener("click", () => {
            const difficulty =
                document.getElementById("pattern-difficulty").value;

            startPatternRecognitionGame(patientId, difficulty);
        });
}

async function startPatternRecognitionGame(patientId, difficulty) {
    const container = document.getElementById("pattern-recognition-game");

    if (!container) {
        return;
    }

    const config = getPatternConfig(difficulty);

    try {
        const engine = createCognitiveGame({
            patientId,
            gameType: GAME_TYPES.PATTERN_RECOGNITION,
            difficulty
        });

        engine.start();

        const { startCognitiveGameSession } =
            await import("./api.js");

        const session = await startCognitiveGameSession(
            engine.getSessionPayload()
        );

        patternGameState = {
            patientId,
            difficulty,
            config,
            engine,
            serverSessionId: session.id,
            currentRound: 0,
            finished: false,
            saving: false,
            round: createPatternRound(config.choices)
        };

        renderPatternRound();
    } catch (error) {
        console.error(
            "Unable to start pattern recognition game:",
            error
        );

        container.innerHTML = `
            <div class="pattern-game">
                <p class="info-note">
                    The activity could not be started.
                </p>
            </div>
        `;
    }
}

function renderPatternRound() {
    const state = patternGameState;
    const area = document.getElementById("pattern-round-area");

    if (!state || !area) {
        return;
    }

    const target = state.round.target;
    const choices = state.round.choices;

    area.innerHTML = `
        <div class="pattern-progress">
            Round ${state.currentRound + 1}
            of ${state.config.rounds}
        </div>

        <div class="pattern-target-card">
            <span class="pattern-target-label">
                Target
            </span>

            <span
                class="pattern-target-symbol"
                aria-hidden="true">
                ${target.symbol}
            </span>

            <strong>${escapePatternHtml(target.label)}</strong>
        </div>

        <p class="pattern-question">
            Which card matches the target?
        </p>

        <div class="pattern-choice-grid">
            ${choices.map((item) => `
                <button
                    type="button"
                    class="pattern-choice"
                    data-object-id="${item.id}"
                    aria-label="${escapePatternHtml(item.label)}">

                    <span
                        class="pattern-choice-symbol"
                        aria-hidden="true">
                        ${item.symbol}
                    </span>

                    <span>
                        ${escapePatternHtml(item.label)}
                    </span>
                </button>
            `).join("")}
        </div>
    `;

    area.querySelectorAll(".pattern-choice").forEach((button) => {
        button.addEventListener("click", () => {
            handlePatternAnswer(button.dataset.objectId);
        });
    });
}

async function handlePatternAnswer(selectedId) {
    const state = patternGameState;

    if (!state || state.finished || state.saving) {
        return;
    }

    const expectedId = state.round.target.id;

    const correct = selectedId === expectedId;

    const responseTimeMs =
        Math.max(
            0,
            Date.now() - state.round.questionStartedAt
        );

    state.engine.recordAnswer({
        correct,
        responseTimeMs,
        score: correct
            ? state.config.pointsPerCorrect
            : 0
    });

    state.currentRound += 1;

    if (state.currentRound >= state.config.rounds) {
        await finishPatternRecognitionGame();
        return;
    }

    state.round = createPatternRound(state.config.choices);

    renderPatternFeedback(correct);
}

function renderPatternFeedback(correct) {
    const area = document.getElementById("pattern-round-area");

    if (!area) {
        return;
    }

    area.innerHTML = `
        <div class="pattern-feedback">
            <h4>
                ${correct ? "Correct!" : "Good try!"}
            </h4>

            <p>
                ${correct
                    ? "You found the matching object."
                    : "Let's try the next one."}
            </p>

            <button
                type="button"
                id="pattern-next-button"
                class="pattern-primary-button">
                Next
            </button>
        </div>
    `;

    document
        .getElementById("pattern-next-button")
        .addEventListener("click", renderPatternRound);
}

async function finishPatternRecognitionGame() {
    const state = patternGameState;

    if (!state || state.finished || state.saving) {
        return;
    }

    state.saving = true;

    try {
        state.engine.finish(COMPLETION_STATUS.COMPLETED);

        const payload = state.engine.getSessionPayload();

        const { saveCognitiveGameSession } =
            await import("./api.js");

        await saveCognitiveGameSession(
            state.serverSessionId,
            payload
        );

        state.finished = true;

        renderPatternResult();
    } catch (error) {
        console.error(
            "Unable to save pattern recognition session:",
            error
        );

        state.saving = false;

        const area =
            document.getElementById("pattern-round-area");

        if (area) {
            area.innerHTML = `
                <div class="pattern-feedback">
                    <h4>Unable to save the result</h4>
                    <p>Please try the activity again.</p>
                </div>
            `;
        }
    }
}

function renderPatternResult() {
    const state = patternGameState;
    const area = document.getElementById("pattern-round-area");

    if (!state || !area) {
        return;
    }

    const result = state.engine.getState();

    area.innerHTML = `
        <div class="pattern-result">
            <h4>Activity complete</h4>

            <p><strong>Score:</strong> ${result.score}</p>
            <p><strong>Accuracy:</strong> ${result.accuracy}%</p>
            <p><strong>Correct:</strong> ${result.correctCount}</p>
            <p><strong>Incorrect:</strong> ${result.incorrectCount}</p>
            <p>
                <strong>Response time:</strong>
                ${formatPatternResponseTime(
                    result.responseTimeMs
                )}
            </p>
            <p>
                <strong>Difficulty:</strong>
                ${escapePatternHtml(state.difficulty)}
            </p>

            <p class="pattern-disclaimer">
                This activity records game performance only.
                It is not a diagnostic assessment.
            </p>

            <button
                type="button"
                id="pattern-replay-button"
                class="pattern-primary-button">
                Play again
            </button>
        </div>
    `;

    document
        .getElementById("pattern-replay-button")
        .addEventListener("click", () => {
            initializePatternRecognitionGame(
                state.patientId
            );
        });
}

function formatPatternResponseTime(responseTimeMs) {
    const seconds =
        Math.round((responseTimeMs || 0) / 100) / 10;

    return `${seconds} seconds`;
}

function escapePatternHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
