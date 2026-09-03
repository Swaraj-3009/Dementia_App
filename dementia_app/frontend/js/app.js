document.addEventListener("DOMContentLoaded", () => {
    initializeNavigation();
    initializeDashboard();
    initializeEmergencyButton();
});


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

    const button =
        document.getElementById("emergency-button");

    if (!button) {
        return;
    }

    button.addEventListener("click", () => {

        alert(
            "Emergency functionality will be implemented in a later stage."
        );
    });
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