const API_BASE_URL = window.MEMORYSAATHI_API_BASE_URL ||
    (["localhost", "127.0.0.1"].includes(window.location.hostname)
        ? "http://localhost:8080"
        : "");

async function request(endpoint, options = {}) {
    if (!API_BASE_URL) {
        throw new Error(
            "Backend URL is not configured. Set MEMORYSAATHI_API_BASE_URL for this deployment."
        );
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        credentials: "include",
        ...options,
        headers: {
            ...(options.body ? { "Content-Type": "application/json" } : {}),
            ...(options.headers || {})
        }
    });

    const contentType = response.headers.get("content-type") || "";

    let data = null;

    if (contentType.includes("application/json")) {
        data = await response.json();
    } else {
        data = await response.text();
    }

    if (!response.ok) {
        const message = typeof data === "string" && data.trim()
            ? data
            : data && typeof data.message === "string" && data.message.trim()
                ? data.message
                : `Request failed with status ${response.status}`;

        throw new Error(message);
    }

    return data;
}


/* =========================================================
   Patient API
   ========================================================= */

async function getPatients() {
    return request("/api/patients");
}

async function getPatient(id) {
    return request(`/api/patients/${id}`);
}

async function createPatient(patient) {
    return request("/api/patients", {
        method: "POST",
        body: JSON.stringify(patient)
    });
}

async function updatePatient(id, patient) {
    return request(`/api/patients/${id}`, {
        method: "PUT",
        body: JSON.stringify(patient)
    });
}

async function deletePatient(id) {
    return request(`/api/patients/${id}`, {
        method: "DELETE"
    });
}


/* =========================================================
   Medication API
   ========================================================= */

async function getMedications() {
    return request("/api/medications");
}

async function getMedication(id) {
    return request(`/api/medications/${id}`);
}

async function createMedication(medication) {
    return request("/api/medications", {
        method: "POST",
        body: JSON.stringify(medication)
    });
}

async function updateMedication(id, medication) {
    return request(`/api/medications/${id}`, {
        method: "PUT",
        body: JSON.stringify(medication)
    });
}

async function deleteMedication(id) {
    return request(`/api/medications/${id}`, { method: "DELETE" });
}


/* =========================================================
   Reminder API
   ========================================================= */

async function getReminders() {
    return request("/api/reminders");
}

async function getReminder(id) {
    return request(`/api/reminders/${id}`);
}

async function createReminder(reminder) {
    return request("/api/reminders", {
        method: "POST",
        body: JSON.stringify(reminder)
    });
}

async function updateReminder(id, reminder) {
    return request(`/api/reminders/${id}`, {
        method: "PUT",
        body: JSON.stringify(reminder)
    });
}

async function deleteReminder(id) {
    return request(`/api/reminders/${id}`, { method: "DELETE" });
}


/* ==========================================================
    Emergency Event
    ========================================================= */
async function triggerEmergencyEvent(patientId, description) {
    return request("/api/emergency-events", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
            patientId,
            description
        })
    });
}

async function getEmergencyEvents(patientId) {
    return request(
        `/api/emergency-events?patientId=${encodeURIComponent(patientId)}`,
        {
            credentials: "include"
        }
    );
}

async function getEmergencyContact() {
    return request("/api/emergency-contact", {
        credentials: "include"
    });
}


/* =========================================================
   Cognitive Game Session API
   ========================================================= */

async function startCognitiveGameSession(session) {

    return request("/api/cognitive-game/sessions", {
        method: "POST",
        body: JSON.stringify({
            patientId: session.patientId,
            gameType: session.gameType,
            difficulty: session.difficulty,
            clientSessionId: session.clientSessionId
        })
    });
}


async function saveCognitiveGameSession(
    sessionId,
    session
) {

    return request(
        `/api/cognitive-game/sessions/${sessionId}`,
        {
            method: "PUT",
            body: JSON.stringify({
                completedAt: session.completedAt,
                difficulty: session.difficulty,
                score: session.score,
                accuracy: session.accuracy,
                responseTimeMs: session.responseTimeMs,
                correctCount: session.correctCount,
                incorrectCount: session.incorrectCount,
                completionStatus: session.completionStatus
            })
        }
    );
}


async function getCognitiveGameSession(sessionId) {

    return request(
        `/api/cognitive-game/sessions/${sessionId}`
    );
}


async function getPatientCognitiveGameSessions(
    patientId
) {

    return request(
        `/api/cognitive-game/sessions/patient/${encodeURIComponent(
            patientId
        )}`
    );
}

async function getCognitivePerformanceAnalytics(patientId) {

    return request(
        `/api/cognitive-game/analytics/patient/${encodeURIComponent(
            patientId
        )}`
    );
}

async function getAdaptiveDifficultyRecommendation(
    patientId,
    gameType,
    currentDifficulty
) {
    const params = new URLSearchParams({
        gameType,
        currentDifficulty
    });

    return request(
        `/api/cognitive-game/adaptive/patient/${encodeURIComponent(
            patientId
        )}?${params.toString()}`
    );
}

/* =========================================================
   Exports
   ========================================================= */

export {
    getPatients,
    getPatient,
    createPatient,
    updatePatient,
    deletePatient,

    getMedications,
    getMedication,
    createMedication,
    updateMedication,
    deleteMedication,

    getReminders,
    getReminder,
    createReminder,
    updateReminder,
    deleteReminder,

    login,
    loginPatient,
    logout,
    getCurrentCaregiver,
    getCurrentPatient,

    triggerEmergencyEvent,
    getEmergencyEvents,
    getEmergencyContact,

    startCognitiveGameSession,
    saveCognitiveGameSession,
    getCognitiveGameSession,
    getPatientCognitiveGameSessions,

    getCognitivePerformanceAnalytics,

    getAdaptiveDifficultyRecommendation
};


/* =========================================================
   Authentication API
   ========================================================= */

async function login(identifier, password) {

    return request("/api/auth/login", {
        method: "POST",

        credentials: "include",

        body: JSON.stringify({
            identifier,
            password
        })
    });
}

async function loginPatient(identifier, password) {
    return request("/api/auth/patient/login", {
        method: "POST",
        body: JSON.stringify({ identifier, password })
    });
}


async function logout() {

    return request("/api/auth/logout", {
        method: "POST",

        credentials: "include"
    });
}


async function getCurrentCaregiver() {

    try {

        return await request(
            "/api/auth/me",
            {
                credentials: "include"
            }
        );

    } catch (error) {

        if (
            error.message &&
            error.message.includes(
                "Authentication required"
            )
        ) {
            return null;
        }

        throw error;
    }
}

async function getCurrentPatient() {
    try {
        return await request("/api/auth/patient/me");
    } catch (error) {
        if (error.message && error.message.includes("Authentication required")) {
            return null;
        }
        throw error;
    }
}
