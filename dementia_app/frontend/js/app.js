document.addEventListener("DOMContentLoaded", () => {
    initializeAuthenticatedDashboard();
});


async function initializeAuthenticatedDashboard() {

    try {

        const api =
            await import("./api.js");

        const caregiver =
            await api.getCurrentCaregiver();

        if (!caregiver) {
            window.location.href =
                "login.html";

            return;
        }

        initializeNavigation();
        initializeDashboard();
        initializeMemoryGameForDashboard();
        initializeAttentionGameForDashboard();
        initializeDailyRoutineRecallGameForDashboard();
        initializePatternRecognitionGameForDashboard();
        initializeCognitivePerformanceTracking();
        initializeEmergencyButton();
        initializeLogout();

    } catch (error) {

        console.error(
            "Authentication check failed:",
            error
        );

        window.location.href =
            "login.html";
    }
}


/* =========================================================
   Memory Game Initialization
   Prompt 20
   ========================================================= */

async function initializeMemoryGameForDashboard() {

    try {

        const api =
            await import("./api.js");


        const patients =
            await api.getPatients();


        if (
            !Array.isArray(patients) ||
            patients.length === 0
        ) {

            console.warn(
                "Memory game cannot start because no patient exists."
            );

            return;
        }


        /*
         * The current dashboard uses the first available
         * patient consistently with renderPatient().
         */
        const patientId =
            patients[0].id;


        const games =
            await import("./games.js");


        games.initializeMemoryGame(
            patientId
        );

    } catch (error) {

        console.error(
            "Memory game initialization failed:",
            error
        );

    }
}


/* =========================================================
    Initialize Attention Game
    ======================================================== */

    async function initializeAttentionGameForDashboard() {
        const container = document.getElementById("attention-game");

        if (!container) {
            return;
        }

        try {
            const { getPatients } = await import("./api.js");
            const patients = await getPatients();

            if (!patients || patients.length === 0) {
                container.innerHTML =
                    '<p class="info-note">No patient is available for this activity.</p>';
                return;
            }

            const { initializeAttentionGame } = await import("./games.js");

            initializeAttentionGame(patients[0].id);
        } catch (error) {
            console.error("Unable to initialize attention game:", error);

            container.innerHTML =
                '<p class="info-note">The attention activity could not be loaded.</p>';
        }
    }


/* =========================================================
    Daily Routine Recall Game
    ======================================================== */

    async function initializeDailyRoutineRecallGameForDashboard() {
        const container = document.getElementById("routine-recall-game");

        if (!container) {
            return;
        }

        try {
            const { getPatients } = await import("./api.js");
            const patients = await getPatients();

            if (!patients || patients.length === 0) {
                container.innerHTML =
                    '<p class="info-note">No patient is available for this activity.</p>';
                return;
            }

            const { initializeDailyRoutineRecallGame } =
                await import("./games.js");

            initializeDailyRoutineRecallGame(patients[0].id);
        } catch (error) {
            console.error(
                "Unable to initialize daily routine recall game:",
                error
            );

            container.innerHTML =
                '<p class="info-note">The routine activity could not be loaded.</p>';
        }
    }


/* =========================================================
    Pattern Recognition Games
    ======================================================== */

    async function initializePatternRecognitionGameForDashboard() {
        const container =
            document.getElementById("pattern-recognition-game");

        if (!container) {
            return;
        }

        try {
            const { getPatients } = await import("./api.js");
            const patients = await getPatients();

            if (!patients || patients.length === 0) {
                container.innerHTML =
                    '<p class="info-note">No patient is available for this activity.</p>';
                return;
            }

            const {
                initializePatternRecognitionGame
            } = await import("./games.js");

            initializePatternRecognitionGame(patients[0].id);
        } catch (error) {
            console.error(
                "Unable to initialize pattern recognition game:",
                error
            );

            container.innerHTML =
                '<p class="info-note">The activity could not be loaded.</p>';
        }
    }


/* =========================================================
   Navigation
   ========================================================= */

function initializeNavigation() {

    const navigationButtons =
        document.querySelectorAll(".nav-button");

    const sections =
        document.querySelectorAll(".content-section");

    navigationButtons.forEach((button) => {

        button.addEventListener("click", () => {

            const targetSection =
                button.dataset.section;

            navigationButtons.forEach((navButton) => {
                navButton.classList.remove("active");
            });

            sections.forEach((section) => {
                section.classList.remove("active-section");
            });

            button.classList.add("active");

            const section =
                document.getElementById(targetSection);

            if (section) {
                section.classList.add("active-section");
            }
        });
    });
}


/* =========================================================
   Dashboard Initialization
   ========================================================= */

async function initializeDashboard() {

    setDashboardStatus("Loading dashboard...");

    try {

        const api =
            await import("./api.js");

        const [
            patients,
            medications,
            reminders
        ] = await Promise.all([
            api.getPatients(),
            api.getMedications(),
            api.getReminders()
        ]);

        renderPatient(patients);
        renderMedications(medications);
        renderReminders(reminders);

        setDashboardStatus(
            "Dashboard loaded successfully.",
            "success"
        );

        if (patients.length > 0) {
            await loadEmergencyData(patients[0].id);
        }

    } catch (error) {

        console.error(
            "Dashboard loading failed:",
            error
        );

        setDashboardStatus(
            getReadableError(error),
            "error"
        );

        renderDashboardErrors();
    }
}


/* =========================================================
   Cognitive Performance Tracking
   ========================================================= */

async function initializeCognitivePerformanceTracking() {

    const selector =
        document.getElementById("cognitive-patient-selector");

    if (!selector) {
        return;
    }

    try {

        const api =
            await import("./api.js");

        const patients =
            await api.getPatients();

        selector.innerHTML = "";

        if (!Array.isArray(patients) ||
            patients.length === 0) {

            selector.innerHTML =
                '<option value="">No patients available</option>';

            renderCognitivePerformanceEmpty(
                "No patient is available for performance tracking."
            );

            return;
        }

        patients.forEach((patient) => {

            const option =
                document.createElement("option");

            option.value = patient.id;

            option.textContent =
                `${patient.name || "Unnamed Patient"} (ID ${patient.id})`;

            selector.appendChild(option);
        });

        selector.addEventListener(
            "change",
            () => {
                loadCognitivePerformance(
                    Number(selector.value)
                );
            }
        );

        await loadCognitivePerformance(
            Number(selector.value)
        );

    } catch (error) {

        console.error(
            "Cognitive performance loading failed:",
            error
        );

        renderCognitivePerformanceEmpty(
            getReadableError(error)
        );
    }
}


async function loadCognitivePerformance(patientId) {

    if (!Number.isFinite(patientId) ||
        patientId <= 0) {

        renderCognitivePerformanceEmpty(
            "Select a valid patient to view results."
        );

        return;
    }

    const container =
        document.getElementById(
            "cognitive-performance-content"
        );

    if (!container) {
        return;
    }

    container.innerHTML =
        '<div class="loading-state">Loading cognitive activity results...</div>';

    try {

        const api =
            await import("./api.js");

        const analytics =
            await api.getCognitivePerformanceAnalytics(
                patientId
            );

        renderCognitivePerformance(analytics);

    } catch (error) {

        console.error(
            "Cognitive performance request failed:",
            error
        );

        renderCognitivePerformanceEmpty(
            getReadableError(error)
        );
    }
}


function renderCognitivePerformance(analytics) {

    const container =
        document.getElementById(
            "cognitive-performance-content"
        );

    if (!container) {
        return;
    }

    const byGameType =
        Array.isArray(analytics.performanceByGameType)
            ? analytics.performanceByGameType
            : [];

    const recentSessions =
        Array.isArray(analytics.recentSessions)
            ? analytics.recentSessions
            : [];

    const history =
        Array.isArray(analytics.history)
            ? analytics.history
            : [];

    container.innerHTML = `

        <div class="cognitive-summary-grid">

            <div class="cognitive-summary-card">
                <span>Total sessions</span>
                <strong>
                    ${analytics.totalSessions ?? 0}
                </strong>
            </div>

            <div class="cognitive-summary-card">
                <span>Completed sessions</span>
                <strong>
                    ${analytics.completedSessions ?? 0}
                </strong>
            </div>

            <div class="cognitive-summary-card">
                <span>Average score</span>
                <strong>
                    ${formatMetric(analytics.averageScore)}
                </strong>
            </div>

            <div class="cognitive-summary-card">
                <span>Average accuracy</span>
                <strong>
                    ${formatMetric(analytics.averageAccuracy)}%
                </strong>
            </div>

            <div class="cognitive-summary-card">
                <span>Average response time</span>
                <strong>
                    ${formatResponseTime(
                        analytics.averageResponseTimeMs
                    )}
                </strong>
            </div>

        </div>

        <div class="cognitive-performance-card">

            <h3>Performance by game</h3>

            ${renderGameTypePerformance(byGameType)}

        </div>

        <div class="cognitive-performance-card">

            <h3>Recent sessions</h3>

            ${renderSessionTable(recentSessions)}

        </div>

        <div class="cognitive-performance-card">

            <h3>Date and time history</h3>

            ${renderSessionTable(history)}

        </div>

        <p class="cognitive-disclaimer">

            These results describe activity in the application only.
            They are not a diagnosis, prediction, or medical assessment
            of dementia.

        </p>
    `;
}


function renderGameTypePerformance(items) {

    if (items.length === 0) {

        return `
            <p class="empty-state">
                No cognitive game sessions recorded yet.
            </p>
        `;
    }

    return `
        <div class="cognitive-game-performance-list">

            ${items.map((item) => `

                <div class="cognitive-game-performance-row">

                    <div>
                        <strong>
                            ${escapeHtml(
                                formatGameType(item.gameType)
                            )}
                        </strong>

                        <span>
                            ${item.sessionCount ?? 0}
                            session(s),
                            ${item.completedCount ?? 0}
                            completed
                        </span>
                    </div>

                    <div>
                        <strong>
                            ${formatMetric(
                                item.averageAccuracy
                            )}%
                        </strong>

                        <span>avg accuracy</span>
                    </div>

                    <div>
                        <strong>
                            ${formatMetric(
                                item.averageScore
                            )}
                        </strong>

                        <span>avg score</span>
                    </div>

                    <div>
                        <strong>
                            ${formatResponseTime(
                                item.averageResponseTimeMs
                            )}
                        </strong>

                        <span>avg response</span>
                    </div>

                </div>

            `).join("")}

        </div>
    `;
}


function renderSessionTable(sessions) {

    if (sessions.length === 0) {

        return `
            <p class="empty-state">
                No sessions recorded yet.
            </p>
        `;
    }

    return `

        <div class="cognitive-history-table-wrapper">

            <table class="cognitive-history-table">

                <thead>
                    <tr>
                        <th>Date / time</th>
                        <th>Game</th>
                        <th>Difficulty</th>
                        <th>Score</th>
                        <th>Accuracy</th>
                        <th>Response time</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>

                    ${sessions.map((session) => `

                        <tr>

                            <td>
                                ${escapeHtml(
                                    formatDateTime(
                                        session.completedAt ||
                                        session.startedAt ||
                                        session.createdAt
                                    )
                                )}
                            </td>

                            <td>
                                ${escapeHtml(
                                    formatGameType(
                                        session.gameType
                                    )
                                )}
                            </td>

                            <td>
                                ${escapeHtml(
                                    session.difficulty ||
                                    "Not set"
                                )}
                            </td>

                            <td>
                                ${formatMetric(session.score)}
                            </td>

                            <td>
                                ${formatMetric(session.accuracy)}%
                            </td>

                            <td>
                                ${formatResponseTime(
                                    session.responseTimeMs
                                )}
                            </td>

                            <td>
                                ${escapeHtml(
                                    formatCompletionStatus(
                                        session.completionStatus
                                    )
                                )}
                            </td>

                        </tr>

                    `).join("")}

                </tbody>

            </table>

        </div>
    `;
}


function renderCognitivePerformanceEmpty(message) {

    const container =
        document.getElementById(
            "cognitive-performance-content"
        );

    if (container) {

        container.innerHTML =
            `<div class="empty-state">
                ${escapeHtml(message)}
            </div>`;
    }
}


function formatMetric(value) {

    if (value === null ||
        value === undefined ||
        value === "") {

        return "0";
    }

    const number = Number(value);

    return Number.isFinite(number)
        ? number.toFixed(2).replace(/\.00$/, "")
        : escapeHtml(value);
}


function formatResponseTime(value) {

    if (value === null ||
        value === undefined ||
        value === "") {

        return "0 ms";
    }

    const number = Number(value);

    return Number.isFinite(number)
        ? `${Math.round(number)} ms`
        : `${escapeHtml(value)} ms`;
}


function formatGameType(value) {

    const labels = {
        MEMORY: "Memory",
        ATTENTION: "Attention",
        DAILY_ROUTINE_RECALL: "Daily Routine Recall",
        PATTERN_RECOGNITION:
            "Pattern / Object Recognition"
    };

    return labels[value] ||
        value ||
        "Unknown game";
}


function formatCompletionStatus(value) {

    const labels = {
        COMPLETED: "Completed",
        IN_PROGRESS: "In progress",
        ABANDONED: "Abandoned"
    };

    return labels[value] ||
        value ||
        "Unknown";
}


/* =========================================================
   Patient
   ========================================================= */

function renderPatient(patients) {

    const container =
        document.getElementById("dashboard-patient");

    if (!container) {
        return;
    }

    if (!Array.isArray(patients) ||
        patients.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                No patients were found.
            </div>
        `;

        return;
    }

    /*
     * The current dashboard uses the first available patient.
     * A patient selector can be added later when the caregiver
     * dashboard supports multiple patients.
     */

    const patient = patients[0];

    container.innerHTML = `
        <div class="card">

            <h3>
                ${escapeHtml(patient.name || "Unnamed Patient")}
            </h3>

            <div class="patient-card">

                <p>
                    <strong>Patient ID:</strong>
                    ${patient.id ?? "N/A"}
                </p>

                <p>
                    <strong>Date of Birth:</strong>
                    ${patient.dateOfBirth || "Not provided"}
                </p>

                <p>
                    <strong>Phone:</strong>
                    ${escapeHtml(patient.phone || "Not provided")}
                </p>

                <p>
                    <strong>Address:</strong>
                    ${escapeHtml(patient.address || "Not provided")}
                </p>

                <p>
                    <strong>Caregiver ID:</strong>
                    ${patient.caregiverId ?? "Not assigned"}
                </p>

            </div>

        </div>
    `;
}


/* =========================================================
   Medications
   ========================================================= */

function renderMedications(medications) {

    const container =
        document.getElementById("dashboard-medications");

    if (!container) {
        return;
    }

    if (!Array.isArray(medications) ||
        medications.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                No medications found.
            </div>
        `;

        return;
    }

    container.innerHTML = "";

    medications.forEach((medication) => {

        const card =
            document.createElement("div");

        card.className = "medication-card card";

        card.innerHTML = `
            <div class="medication-name">
                ${escapeHtml(
                    medication.name || "Unnamed medication"
                )}
            </div>

            <div class="medication-details">

                <p>
                    <strong>Patient ID:</strong>
                    ${medication.patientId ?? "N/A"}
                </p>

                <p>
                    <strong>Dosage:</strong>
                    ${escapeHtml(
                        medication.dosage || "Not provided"
                    )}
                </p>

                <p>
                    <strong>Frequency:</strong>
                    ${escapeHtml(
                        medication.frequency || "Not provided"
                    )}
                </p>

                <p>
                    <strong>Instructions:</strong>
                    ${escapeHtml(
                        medication.instructions || "Not provided"
                    )}
                </p>

                <p>
                    <strong>Start Date:</strong>
                    ${medication.startDate || "Not provided"}
                </p>

                <p>
                    <strong>End Date:</strong>
                    ${medication.endDate || "Ongoing"}
                </p>

            </div>
        `;

        container.appendChild(card);
    });
}


/* =========================================================
   Reminders
   ========================================================= */

function renderReminders(reminders) {

    const container =
        document.getElementById("dashboard-reminders");

    if (!container) {
        return;
    }

    if (!Array.isArray(reminders) ||
        reminders.length === 0) {

        container.innerHTML = `
            <div class="empty-state">
                No reminders found.
            </div>
        `;

        return;
    }

    container.innerHTML = "";

    reminders.forEach((reminder) => {

        const card =
            document.createElement("div");

        card.className = "reminder-card";

        card.innerHTML = `
            <div class="reminder-time">
                ${formatTime(reminder.reminderTime)}
            </div>

            <div class="reminder-content">

                <h3>
                    ${escapeHtml(
                        reminder.title || "Reminder"
                    )}
                </h3>

                <p>
                    ${escapeHtml(
                        reminder.description || ""
                    )}
                </p>

                <span class="reminder-category">
                    ${escapeHtml(
                        reminder.category || "Unknown"
                    )}
                </span>

            </div>

            <div class="reminder-status">
                ${escapeHtml(
                    reminder.status || "PENDING"
                )}
            </div>
        `;

        container.appendChild(card);
    });
}


/* =========================================================
   Emergency
   ========================================================= */

function initializeEmergencyButton() {
    const button = document.getElementById("emergency-trigger-button");

    if (!button) {
        return;
    }

    button.addEventListener("click", async () => {
        const statusElement =
            document.getElementById("emergency-status");

        try {
            const api = await import("./api.js");

            const patients = await api.getPatients();

            if (!patients || patients.length === 0) {
                throw new Error(
                    "No patient is available for the emergency event."
                );
            }

            const patient = patients[0];

            const confirmed = window.confirm(
                "Record an emergency assistance event for this patient?"
            );

            if (!confirmed) {
                return;
            }

            button.disabled = true;

            const event = await api.triggerEmergencyEvent(
                patient.id,
                "Emergency assistance was triggered from the caregiver dashboard."
            );

            statusElement.textContent =
                `Emergency event recorded at ${formatDateTime(event.eventTimestamp)}.`;

            statusElement.className =
                "status-message success";

            await loadEmergencyData(patient.id);

        } catch (error) {
            console.error(
                "Emergency event could not be recorded:",
                error
            );

            statusElement.textContent =
                error.message || "Unable to record emergency event.";

            statusElement.className =
                "status-message error";

        } finally {
            button.disabled = false;
        }
    });
}

async function loadEmergencyData(patientId) {
    try {
        const api = await import("./api.js");

        const [events, contact] = await Promise.all([
            api.getEmergencyEvents(patientId),
            api.getEmergencyContact()
        ]);

        renderEmergencyEvents(events);
        renderEmergencyContact(contact);

    } catch (error) {
        console.error(
            "Failed to load emergency information:",
            error
        );
    }
}

function renderEmergencyEvents(events) {
    const container =
        document.getElementById("emergency-events-list");

    if (!container) {
        return;
    }

    if (!events || events.length === 0) {
        container.innerHTML =
            "<p>No emergency events recorded.</p>";
        return;
    }

    container.innerHTML = events.map(event => `
        <div class="emergency-event">
            <strong>${escapeHtml(event.status)}</strong>
            <p>${escapeHtml(event.description)}</p>
            <small>
                ${escapeHtml(formatDateTime(event.eventTimestamp))}
            </small>
        </div>
    `).join("");
}

function renderEmergencyContact(contact) {
    const nameElement =
        document.getElementById("emergency-contact-name");

    const phoneElement =
        document.getElementById("emergency-contact-phone");

    if (!nameElement || !phoneElement) {
        return;
    }

    if (!contact || (!contact.name && !contact.phone)) {
        nameElement.textContent =
            "Emergency contact is not configured.";

        phoneElement.textContent = "";
        return;
    }

    nameElement.textContent =
        contact.name || "Configured contact";

    phoneElement.textContent =
        contact.phone || "Contact number not configured.";
}

function formatDateTime(value) {
    if (!value) {
        return "Unknown time";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString();
}

function escapeHtml(value) {
    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


/* =========================================================
   Dashboard Status
   ========================================================= */

function setDashboardStatus(message, type = "loading") {

    const status =
        document.getElementById("dashboard-status");

    if (!status) {
        return;
    }

    status.textContent = message;

    status.dataset.status = type;
}


/* =========================================================
   Dashboard Error State
   ========================================================= */

function renderDashboardErrors() {

    const containers = [
        "dashboard-patient",
        "dashboard-medications",
        "dashboard-reminders"
    ];

    containers.forEach((id) => {

        const container =
            document.getElementById(id);

        if (!container) {
            return;
        }

        container.innerHTML = `
            <div class="error-state">
                Unable to load this information from the backend.
                Check that Spring Boot and MySQL are running.
            </div>
        `;
    });
}


/* =========================================================
   Time Formatting
   ========================================================= */

function formatTime(time) {

    if (!time) {
        return "No time";
    }

    /*
     * Backend returns LocalTime JSON such as:
     * 09:00:00
     */

    const parts = time.split(":");

    if (parts.length < 2) {
        return time;
    }

    const hour =
        Number(parts[0]);

    const minute =
        parts[1];

    if (Number.isNaN(hour)) {
        return time;
    }

    const suffix =
        hour >= 12 ? "PM" : "AM";

    const displayHour =
        hour % 12 || 12;

    return `${displayHour}:${minute} ${suffix}`;
}


/* =========================================================
   Error Handling
   ========================================================= */

function getReadableError(error) {

    if (!error) {
        return "Something went wrong.";
    }

    if (error instanceof TypeError) {

        return (
            "Could not connect to the backend. " +
            "Make sure Spring Boot is running on " +
            "http://localhost:8080."
        );
    }

    return error.message ||
        "Something went wrong while loading the dashboard.";
}


/* =========================================================
   HTML Safety
   ========================================================= */

function escapeHtml(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

function initializeLogout() {

    const logoutButton =
        document.getElementById("logout-button");

    if (!logoutButton) {
        return;
    }

    logoutButton.addEventListener(
        "click",
        async () => {

            try {

                const api =
                    await import("./api.js");

                await api.logout();

                window.location.href =
                    "login.html";

            } catch (error) {

                console.error(
                    "Logout failed:",
                    error
                );

                alert(
                    "Unable to logout. Please try again."
                );
            }
        }
    );
}
