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