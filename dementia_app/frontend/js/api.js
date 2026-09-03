const API_BASE_URL = "http://localhost:8080";

async function request(endpoint, options = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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
        const message =
            typeof data === "string" && data.trim()
                ? data
                : `Request failed with status ${response.status}`;

        throw new Error(message);
    }

    return data;
}

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

export {
    getPatients,
    getPatient,
    createPatient,
    updatePatient,
    deletePatient
};

const API_BASE_URL = "http://localhost:8080";

async function request(endpoint, options = {}) {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
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
        const message =
            typeof data === "string" && data.trim()
                ? data
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


/* =========================================================
   Reminder API
   ========================================================= */

async function getReminders() {
    return request("/api/reminders");
}

async function getReminder(id) {
    return request(`/api/reminders/${id}`);
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

    getReminders,
    getReminder,

    login,
    logout,
    getCurrentCaregiver
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