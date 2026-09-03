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