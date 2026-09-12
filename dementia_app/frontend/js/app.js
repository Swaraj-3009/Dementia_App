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

        renderCaregiverInfo(caregiver);
        initializeNavigation();
        initializeDashboard();
        initializeCognitivePerformanceTracking();
        initializeEmergencyButton();
        initializeEmergencyContactForm();
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
   Caregiver Info (logged-in caregiver, not a demo placeholder)
   ========================================================= */

function renderCaregiverInfo(caregiver) {
    const nameEl = document.getElementById("caregiver-name");
    const usernameEl = document.getElementById("caregiver-username");
    const emailEl = document.getElementById("caregiver-email");
    const phoneEl = document.getElementById("caregiver-phone");

    if (nameEl) nameEl.textContent = caregiver.name || "Caregiver";
    if (usernameEl) usernameEl.textContent = caregiver.username || "—";
    if (emailEl) emailEl.textContent = caregiver.email || "—";
    if (phoneEl) phoneEl.textContent = caregiver.phone || "—";
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
        initializeAddPatientForm();
        renderMedications(medications, patients);
        renderReminders(reminders, patients);
        initializeMedicationForm();
        initializeReminderForm();
        initializePatientEditForm();
        initializeReminderPatientSelector(patients, reminders);
        populatePatientSelects(patients);

        setDashboardStatus(
            "Dashboard loaded successfully.",
            "success"
        );

        initializeEmergencyPatientSelector(patients);
        initializeGamePatientSelector(patients);

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
                "No patients available."
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

        const [analytics, recommendations] = await Promise.all([
            api.getCognitivePerformanceAnalytics(patientId),
            Promise.all([
                "MEMORY", "ATTENTION", "DAILY_ROUTINE_RECALL", "PATTERN_RECOGNITION"
            ].map(gameType => api.getAdaptiveDifficultyRecommendation(patientId, gameType, "EASY")))
        ]);

        renderCognitivePerformance(analytics, recommendations);

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


function renderCognitivePerformance(analytics, recommendations = []) {

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

    if ((analytics.completedSessions ?? 0) === 0) {
        container.innerHTML = `
            <div class="empty-state">No cognitive activity recorded yet.</div>
            <p class="cognitive-disclaimer">These analytics are activity-tracking insights and are not a clinical diagnosis or medical assessment.</p>`;
        return;
    }

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

            <h3>Recommended difficulty</h3>
            <div class="cognitive-game-performance-list">
                ${recommendations.map(item => `<div class="cognitive-game-performance-row"><strong>${escapeHtml(formatGameType(item.gameType))}</strong><span>${escapeHtml(item.recommendedDifficulty || "EASY")}</span><span>${escapeHtml(item.explanation || "")}</span></div>`).join("")}
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

            These analytics are activity-tracking insights and are not a clinical diagnosis or medical assessment.

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

    container.innerHTML = patients.map((patient) => `
        <div class="card">

            <h3>
                ${escapeHtml(patient.name || "Unnamed Patient")}
            </h3>

            <div class="patient-card">

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

            </div>
            <button type="button" class="secondary-button" data-edit-patient-id="${patient.id}">Edit details</button>
            <button type="button" class="danger-button" data-remove-patient-id="${patient.id}">Remove patient</button>

        </div>
    `).join("");

    container.querySelectorAll("[data-remove-patient-id]").forEach((button) => {
        button.addEventListener("click", () => removePatient(button.dataset.removePatientId));
    });
    container.querySelectorAll("[data-edit-patient-id]").forEach((button) => {
        button.addEventListener("click", () => selectPatientForEditing(button.dataset.editPatientId, patients));
    });
}

function initializeAddPatientForm() {
    const form = document.getElementById("add-patient-form");
    if (!form || form.dataset.bound) return;
    form.dataset.bound = "true";
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const status = document.getElementById("add-patient-status");
        const data = new FormData(form);
        const patient = Object.fromEntries(data.entries());
        if (!patient.dateOfBirth) delete patient.dateOfBirth;
        try {
            const api = await import("./api.js");
            await api.createPatient(patient);
            form.reset(); status.textContent = "Patient added.";
            const patients = await api.getPatients();
            renderPatient(patients);
            populatePatientSelects(patients);
            refreshPatientSpecificViews(patients);
            initializeReminderPatientSelector(patients, await api.getReminders());
        } catch (error) { status.textContent = error.message || "Unable to add patient."; }
    });
}

function initializePatientEditForm() {
    const form = document.getElementById("edit-patient-form");
    if (!form || form.dataset.bound) return;
    form.dataset.bound = "true";
    form.elements.patientId.addEventListener("change", async () => {
        const patientId = form.elements.patientId.value;
        if (!patientId) return;
        const api = await import("./api.js");
        selectPatientForEditing(patientId, [await api.getPatient(patientId)]);
    });
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const status = document.getElementById("edit-patient-status");
        const patient = Object.fromEntries(new FormData(form).entries());
        const patientId = patient.patientId;
        delete patient.patientId;
        if (!patient.dateOfBirth) delete patient.dateOfBirth;
        if (!patient.phone) patient.phone = null;
        if (!patient.address) patient.address = null;
        try {
            const api = await import("./api.js");
            await api.updatePatient(patientId, patient);
            const patients = await api.getPatients();
            renderPatient(patients);
            populatePatientSelects(patients);
            refreshPatientSpecificViews(patients);
            initializeReminderPatientSelector(patients, await api.getReminders());
            form.elements.patientId.value = String(patientId);
            status.textContent = "Patient details saved.";
        } catch (error) {
            status.textContent = error.message || "Unable to save patient details.";
        }
    });
}

function selectPatientForEditing(patientId, patients) {
    const patient = patients.find(item => String(item.id) === String(patientId));
    const form = document.getElementById("edit-patient-form");
    if (!patient || !form) return;
    form.elements.patientId.value = String(patient.id);
    form.elements.name.value = patient.name || "";
    form.elements.dateOfBirth.value = patient.dateOfBirth || "";
    form.elements.phone.value = patient.phone || "";
    form.elements.address.value = patient.address || "";
    form.scrollIntoView({ behavior: "smooth", block: "center" });
    form.elements.name.focus();
}

async function removePatient(patientId) {
    const patientName = document.querySelector(`[data-remove-patient-id="${patientId}"]`)?.closest(".card")?.querySelector("h3")?.textContent?.trim() || "this patient";
    if (!window.confirm(`Remove ${patientName}? This also removes their medications, reminders, emergency contact, and related care records.`)) return;

    try {
        const api = await import("./api.js");
        await api.deletePatient(patientId);
        const [patients, medications, reminders] = await Promise.all([
            api.getPatients(), api.getMedications(), api.getReminders()
        ]);
        renderPatient(patients);
        renderMedications(medications);
        renderReminders(reminders, patients);
        populatePatientSelects(patients);
        refreshPatientSpecificViews(patients);
        initializeReminderPatientSelector(patients, reminders);
        setDashboardStatus("Patient removed.", "success");
    } catch (error) {
        setDashboardStatus(error.message || "Unable to remove patient.", "error");
    }
}

function populatePatientSelects(patients) {
    document.querySelectorAll("form .patient-select").forEach((select) => {
        const currentValue = select.value;
        select.innerHTML = '<option value="">Select a patient</option>';
        patients.forEach((patient) => {
            const option = document.createElement("option");
            option.value = patient.id;
            option.textContent = `${patient.name || "Unnamed patient"} (ID ${patient.id})`;
            select.appendChild(option);
        });
        select.value = currentValue;
    });
}

function getPatientName(patientId, patients) {
    const patient = patients.find(item => String(item.id) === String(patientId));
    return patient ? (patient.name || `Patient ${patient.id}`) : `Patient ID ${patientId ?? "unknown"}`;
}

function initializeReminderPatientSelector(patients, reminders) {
    const selector = document.getElementById("reminder-patient-selector");
    if (!selector) return;
    const previousValue = selector.value;
    selector.innerHTML = '<option value="">All patients</option>';
    patients.forEach((patient) => {
        const option = document.createElement("option");
        option.value = patient.id;
        option.textContent = patient.name || `Patient ${patient.id}`;
        selector.appendChild(option);
    });
    selector.value = patients.some(patient => String(patient.id) === previousValue) ? previousValue : "";
    if (!selector.dataset.bound) {
        selector.dataset.bound = "true";
        selector.addEventListener("change", async () => {
            const api = await import("./api.js");
            const currentPatients = await api.getPatients();
            const selectedReminders = selector.value
                ? await api.getPatientReminders(selector.value)
                : await api.getReminders();
            renderReminders(selectedReminders, currentPatients);
        });
    }
    renderReminders(selector.value
        ? reminders.filter(reminder => String(reminder.patientId) === selector.value)
        : reminders, patients);
}

async function initializeGamePatientSelector(patients = null) {
    const selector = document.getElementById("game-patient-selector");
    if (!selector) return;
    try {
        const api = await import("./api.js");
        const availablePatients = patients || await api.getPatients();
        const previousValue = selector.value;
        selector.innerHTML = '<option value="">Select a patient</option>';
        availablePatients.forEach((patient) => {
            const option = document.createElement("option");
            option.value = patient.id;
            option.textContent = patient.name || `Patient ${patient.id}`;
            selector.appendChild(option);
        });
        selector.value = availablePatients.some(patient => String(patient.id) === previousValue)
            ? previousValue : (availablePatients[0] ? String(availablePatients[0].id) : "");
        const loadGames = async () => {
            const patientId = Number(selector.value);
            if (!patientId) return;
            const games = await import("./games.js");
            games.initializeMemoryGame(patientId);
            games.initializeAttentionGame(patientId);
            games.initializeDailyRoutineRecallGame(patientId);
            games.initializePatternRecognitionGame(patientId);
        };
        if (!selector.dataset.bound) {
            selector.dataset.bound = "true";
            selector.addEventListener("change", loadGames);
        }
        await loadGames();
    } catch (error) {
        console.error("Unable to load the game patient selector:", error);
    }
}

function refreshPatientSpecificViews(patients) {
    initializeEmergencyPatientSelector(patients);
    initializeGamePatientSelector(patients);
}


/* =========================================================
   Medications
   ========================================================= */

function renderMedications(medications, patients = []) {

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

                <p><strong>Patient:</strong> ${escapeHtml(getPatientName(medication.patientId, patients))}</p>

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
            <button type="button" class="secondary-button" data-delete-medication-id="${medication.id}">Remove medication</button>
        `;

        container.appendChild(card);
    });

    container.querySelectorAll("[data-delete-medication-id]").forEach((button) => {
        button.addEventListener("click", () => removeMedication(button.dataset.deleteMedicationId));
    });
}

function initializeMedicationForm() {
    const form = document.getElementById("add-medication-form");
    if (!form || form.dataset.bound) return;
    form.dataset.bound = "true";
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const status = document.getElementById("add-medication-status");
        const medication = Object.fromEntries(new FormData(form).entries());
        medication.patientId = Number(medication.patientId);
        ["startDate", "endDate", "dosage", "frequency", "instructions"].forEach((field) => {
            if (!medication[field]) delete medication[field];
        });
        try {
            const api = await import("./api.js");
            await api.createMedication(medication);
            form.reset();
            const [medications, patients] = await Promise.all([api.getMedications(), api.getPatients()]);
            renderMedications(medications, patients);
            status.textContent = "Medication added.";
        } catch (error) { status.textContent = error.message || "Unable to add medication."; }
    });
}

async function removeMedication(medicationId) {
    if (!window.confirm("Remove this medication?")) return;
    try {
        const api = await import("./api.js");
        await api.deleteMedication(medicationId);
        const [medications, patients] = await Promise.all([api.getMedications(), api.getPatients()]);
        renderMedications(medications, patients);
        setDashboardStatus("Medication removed.", "success");
    } catch (error) { setDashboardStatus(error.message || "Unable to remove medication.", "error"); }
}


/* =========================================================
   Reminders
   ========================================================= */

function renderReminders(reminders, patients = []) {

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

                <p class="reminder-patient">
                    <strong>Patient:</strong>
                    ${escapeHtml(getPatientName(reminder.patientId, patients))}
                </p>

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
            <button type="button" class="secondary-button" data-delete-reminder-id="${reminder.id}">Remove reminder</button>
        `;

        container.appendChild(card);
    });

    container.querySelectorAll("[data-delete-reminder-id]").forEach((button) => {
        button.addEventListener("click", () => removeReminder(button.dataset.deleteReminderId));
    });
}

function initializeReminderForm() {
    const form = document.getElementById("add-reminder-form");
    if (!form || form.dataset.bound) return;
    form.dataset.bound = "true";
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const status = document.getElementById("add-reminder-status");
        const reminder = Object.fromEntries(new FormData(form).entries());
        reminder.patientId = Number(reminder.patientId);
        if (!reminder.description) delete reminder.description;
        try {
            const api = await import("./api.js");
            await api.createReminder(reminder);
            form.reset();
            const [reminders, patients] = await Promise.all([api.getReminders(), api.getPatients()]);
            renderReminders(reminders, patients);
            initializeReminderPatientSelector(patients, reminders);
            status.textContent = "Reminder added.";
        } catch (error) { status.textContent = error.message || "Unable to add reminder."; }
    });
}

async function removeReminder(reminderId) {
    if (!window.confirm("Remove this reminder?")) return;
    try {
        const api = await import("./api.js");
        await api.deleteReminder(reminderId);
        const [reminders, patients] = await Promise.all([api.getReminders(), api.getPatients()]);
        renderReminders(reminders, patients);
        initializeReminderPatientSelector(patients, reminders);
        setDashboardStatus("Reminder removed.", "success");
    } catch (error) { setDashboardStatus(error.message || "Unable to remove reminder.", "error"); }
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

            const selector = document.getElementById("emergency-patient-selector");
            const patientId = Number(selector?.value);

            if (!Number.isFinite(patientId) || patientId <= 0) {
                throw new Error("Select the patient needing assistance before recording an emergency event.");
            }

            const patientName = selector.options[selector.selectedIndex]?.textContent || "this patient";

            const confirmed = window.confirm(
                `Record an emergency assistance event for ${patientName}?`
            );

            if (!confirmed) {
                return;
            }

            button.disabled = true;

            const event = await api.triggerEmergencyEvent(
                patientId,
                "Emergency assistance was triggered from the caregiver dashboard."
            );

            statusElement.textContent =
                `Emergency event for ${patientName} recorded at ${formatDateTime(event.eventTimestamp)}.`;

            statusElement.className =
                "status-message success";

            await loadEmergencyData(patientId, patientName);

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

function initializeEmergencyPatientSelector(patients) {
    const selector = document.getElementById("emergency-patient-selector");
    if (!selector) return;
    const previousValue = selector.value;
    selector.innerHTML = '<option value="">Select a patient</option>';
    patients.forEach((patient) => {
        const option = document.createElement("option");
        option.value = patient.id;
        option.textContent = patient.name || `Patient ${patient.id}`;
        selector.appendChild(option);
    });
    selector.value = patients.some(patient => String(patient.id) === previousValue)
        ? previousValue : (patients[0] ? String(patients[0].id) : "");
    if (!selector.dataset.bound) {
        selector.dataset.bound = "true";
        selector.addEventListener("change", () => {
            if (selector.value) loadEmergencyData(selector.value, selector.options[selector.selectedIndex]?.textContent);
        });
    }
    if (selector.value) loadEmergencyData(selector.value, selector.options[selector.selectedIndex]?.textContent);
    else { renderEmergencyEvents([]); renderEmergencyContact(null); }
}

function initializeEmergencyContactForm() {
    const form = document.getElementById("emergency-contact-form");
    if (!form || form.dataset.bound) return;
    form.dataset.bound = "true";
    form.elements.patientId.addEventListener("change", async () => {
        const patientId = form.elements.patientId.value;
        if (!patientId) return;
        const api = await import("./api.js");
        const contact = await api.getPatientEmergencyContact(patientId).catch(() => null);
        form.elements.name.value = contact?.name || "";
        form.elements.phone.value = contact?.phone || "";
        form.elements.relationship.value = contact?.relationship || "";
        const emergencySelector = document.getElementById("emergency-patient-selector");
        if (emergencySelector) emergencySelector.value = String(patientId);
        const patientName = emergencySelector?.options[emergencySelector.selectedIndex]?.textContent || "Selected patient";
        await loadEmergencyData(patientId, patientName);
    });
    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const status = document.getElementById("emergency-contact-form-status");
        const values = Object.fromEntries(new FormData(form).entries());
        const patientId = values.patientId;
        delete values.patientId;
        try {
            const api = await import("./api.js");
            await api.savePatientEmergencyContact(patientId, values);
            status.textContent = "Emergency contact saved.";
            const emergencySelector = document.getElementById("emergency-patient-selector");
            if (emergencySelector) emergencySelector.value = String(patientId);
            const patientName = emergencySelector?.options[emergencySelector.selectedIndex]?.textContent || "Selected patient";
            await loadEmergencyData(patientId, patientName);
        } catch (error) { status.textContent = error.message || "Unable to save contact."; }
    });
}

async function loadEmergencyData(patientId, patientName = "Selected patient") {
    try {
        const api = await import("./api.js");

        const [events, contact] = await Promise.all([
            api.getEmergencyEvents(patientId),
            api.getPatientEmergencyContact(patientId).catch(() => null)
        ]);

        renderEmergencyEvents(events, patientName);
        renderEmergencyContact(contact);

    } catch (error) {
        console.error(
            "Failed to load emergency information:",
            error
        );
    }
}

function renderEmergencyEvents(events, patientName = "Selected patient") {
    const container =
        document.getElementById("emergency-events-list");

    if (!container) {
        return;
    }

    if (!events || events.length === 0) {
        container.innerHTML =
            `<p>No emergency events recorded for ${escapeHtml(patientName)}.</p>`;
        return;
    }

    container.innerHTML = events.map(event => `
        <div class="emergency-event">
            <strong>${escapeHtml(event.status)} · ${escapeHtml(patientName)}</strong>
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
                This information is unavailable right now. Please try again shortly.
            </div>
        `;
    });
}


/* =========================================================
    Legacy analytics helpers
    ======================================================== */

    async function loadCognitiveAnalytics(patientId) {
    if (!patientId) {
        return;
    }

    const container = document.getElementById("cognitive-analytics");

    if (!container) {
        return;
    }

    container.innerHTML = "<p>Loading cognitive activity...</p>";

    try {
        const { getPatientCognitiveGameSessions } = await import("./api.js");
        const sessions = await getPatientCognitiveGameSessions(patientId);

        const completedSessions = Array.isArray(sessions)
            ? sessions.filter(
                  session => session.completionStatus === "COMPLETED"
              )
            : [];

        renderCognitiveAnalytics(
            container,
            completedSessions,
            patientId
        );
    } catch (error) {
        console.error("Failed to load cognitive analytics:", error);

        container.innerHTML = `
            <p class="error-message">
                Unable to load cognitive activity right now.
            </p>
        `;
    }
}

function renderCognitiveAnalytics(
    container,
    sessions,
    patientId
) {
    const gameTypes = [
        {
            key: "MEMORY",
            label: "Memory"
        },
        {
            key: "ATTENTION",
            label: "Attention"
        },
        {
            key: "DAILY_ROUTINE_RECALL",
            label: "Routine Recall"
        },
        {
            key: "PATTERN_RECOGNITION",
            label: "Pattern/Object Recognition"
        }
    ];

    const totalSessions = sessions.length;

    const averageAccuracy =
        totalSessions === 0
            ? 0
            : sessions.reduce(
                  (sum, session) =>
                      sum + Number(session.accuracy || 0),
                  0
              ) / totalSessions;

    const latestSession =
        sessions.length > 0
            ? sessions[0]
            : null;

    container.innerHTML = `
        <div class="cognitive-summary-grid">

            <div class="analytics-card">
                <span class="analytics-label">
                    Overall Activity
                </span>
                <strong>${totalSessions}</strong>
                <small>Completed sessions</small>
            </div>

            <div class="analytics-card">
                <span class="analytics-label">
                    Average Accuracy
                </span>
                <strong>
                    ${Math.round(averageAccuracy)}%
                </strong>
                <div class="progress-track">
                    <div
                        class="progress-fill"
                        style="width:${Math.min(
                            averageAccuracy,
                            100
                        )}%"
                    ></div>
                </div>
            </div>

            <div class="analytics-card">
                <span class="analytics-label">
                    Latest Score
                </span>
                <strong>
                    ${
                        latestSession
                            ? Number(latestSession.score || 0)
                            : "—"
                    }
                </strong>
                <small>Most recent completed game</small>
            </div>

        </div>

        <div class="cognitive-games-grid">
            ${gameTypes
                .map(game =>
                    renderGameAnalytics(game, sessions)
                )
                .join("")}
        </div>

        <div class="analytics-card cognitive-history">
            <h4>Recent Cognitive Activity</h4>
            ${renderRecentSessions(sessions)}
        </div>

        <div class="analytics-disclaimer">
            <strong>Activity tracking only:</strong>
            These analytics summarize game activity and performance.
            They are not a clinical diagnosis, medical assessment,
            prediction, or treatment recommendation.
        </div>
    `;
}

function renderGameAnalytics(game, sessions) {
    const gameSessions = sessions.filter(
        session => session.gameType === game.key
    );

    const averageAccuracy =
        gameSessions.length === 0
            ? 0
            : gameSessions.reduce(
                  (sum, session) =>
                      sum + Number(session.accuracy || 0),
                  0
              ) / gameSessions.length;

    const latest =
        gameSessions.length > 0
            ? gameSessions[0]
            : null;

    return `
        <div class="analytics-card game-analytics-card">
            <h4>${game.label}</h4>

            <div class="game-stat-row">
                <span>Sessions</span>
                <strong>${gameSessions.length}</strong>
            </div>

            <div class="game-stat-row">
                <span>Average accuracy</span>
                <strong>${Math.round(
                    averageAccuracy
                )}%</strong>
            </div>

            <div class="progress-track">
                <div
                    class="progress-fill"
                    style="width:${Math.min(
                        averageAccuracy,
                        100
                    )}%"
                ></div>
            </div>

            ${
                latest
                    ? `
                        <div class="game-stat-row">
                            <span>Latest score</span>
                            <strong>
                                ${Number(latest.score || 0)}
                            </strong>
                        </div>

                        <div class="game-stat-row">
                            <span>Difficulty</span>
                            <strong>
                                ${latest.difficulty || "—"}
                            </strong>
                        </div>
                    `
                    : `
                        <small>No completed sessions yet.</small>
                    `
            }
        </div>
    `;
}

function renderRecentSessions(sessions) {
    if (sessions.length === 0) {
        return "<p>No completed cognitive sessions yet.</p>";
    }

    return `
        <div class="recent-session-list">
            ${sessions
                .slice(0, 5)
                .map(session => `
                    <div class="recent-session-row">
                        <span>
                            ${formatGameType(session.gameType)}
                        </span>

                        <span>
                            Score:
                            ${Number(session.score || 0)}
                        </span>

                        <span>
                            Accuracy:
                            ${Math.round(
                                Number(session.accuracy || 0)
                            )}%
                        </span>

                        <span>
                            ${session.difficulty || "—"}
                        </span>
                    </div>
                `)
                .join("")}
        </div>
    `;
}

function formatGameType(gameType) {
    const labels = {
        MEMORY: "Memory",
        ATTENTION: "Attention",
        DAILY_ROUTINE_RECALL: "Routine Recall",
        PATTERN_RECOGNITION: "Pattern/Object Recognition"
    };

    return labels[gameType] || gameType;
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

        return "We could not load this right now. Please try again shortly.";
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
