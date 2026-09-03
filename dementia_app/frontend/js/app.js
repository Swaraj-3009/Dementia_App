document.addEventListener("DOMContentLoaded", () => {
    initializeNavigation();
    initializeDemoButtons();
    initializePatientApi();
});


/* =========================================================
   Existing Navigation
   ========================================================= */

function initializeNavigation() {
    const navigationButtons = document.querySelectorAll(".nav-button");
    const sections = document.querySelectorAll(".content-section");

    navigationButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const targetSection = button.dataset.section;

            if (!targetSection) {
                return;
            }

            navigationButtons.forEach((navButton) => {
                navButton.classList.remove("active");
            });

            sections.forEach((section) => {
                section.classList.remove("active-section");
            });

            button.classList.add("active");

            const section = document.getElementById(targetSection);

            if (section) {
                section.classList.add("active-section");
            }
        });
    });
}


/* =========================================================
   Existing Demo Buttons
   ========================================================= */

function initializeDemoButtons() {
    const emergencyButton = document.getElementById("emergency-button");

    if (emergencyButton) {
        emergencyButton.addEventListener("click", () => {
            alert(
                "Emergency functionality will be connected to the backend in a later stage."
            );
        });
    }
}


/* =========================================================
   Patient REST API
   ========================================================= */

async function initializePatientApi() {
    try {
        const api = await import("./api.js");

        setupPatientManagementUI(api);

        await loadPatients(api);
    } catch (error) {
        console.error("Patient API initialization failed:", error);

        showPatientStatus(
            "Unable to connect to the patient backend. Make sure Spring Boot is running on http://localhost:8080.",
            "error"
        );
    }
}


/* =========================================================
   Patient UI
   ========================================================= */

function setupPatientManagementUI(api) {
    const patientSection = document.getElementById("patient");

    if (!patientSection) {
        return;
    }

    const managementContainer = document.createElement("div");

    managementContainer.className = "card";
    managementContainer.id = "patient-api-management";

    managementContainer.style.marginTop = "24px";

    managementContainer.innerHTML = `
        <h2>Patient Management</h2>

        <p id="patient-api-status"
           style="
                min-height: 24px;
                margin: 12px 0;
                font-weight: 600;
           ">
        </p>

        <form id="patient-form">

            <input
                type="hidden"
                id="patient-id"
            >

            <div style="margin-bottom: 16px;">
                <label for="patient-name">
                    <strong>Patient Name *</strong>
                </label>

                <input
                    type="text"
                    id="patient-name"
                    required
                    placeholder="Enter patient name"
                    style="
                        display: block;
                        width: 100%;
                        min-height: 48px;
                        margin-top: 6px;
                        padding: 10px;
                        font-size: 16px;
                        box-sizing: border-box;
                    "
                >
            </div>

            <div style="margin-bottom: 16px;">
                <label for="patient-caregiver-id">
                    <strong>Caregiver ID</strong>
                </label>

                <input
                    type="number"
                    id="patient-caregiver-id"
                    min="1"
                    placeholder="Optional"
                    style="
                        display: block;
                        width: 100%;
                        min-height: 48px;
                        margin-top: 6px;
                        padding: 10px;
                        font-size: 16px;
                        box-sizing: border-box;
                    "
                >
            </div>

            <div style="margin-bottom: 16px;">
                <label for="patient-date-of-birth">
                    <strong>Date of Birth</strong>
                </label>

                <input
                    type="date"
                    id="patient-date-of-birth"
                    style="
                        display: block;
                        width: 100%;
                        min-height: 48px;
                        margin-top: 6px;
                        padding: 10px;
                        font-size: 16px;
                        box-sizing: border-box;
                    "
                >
            </div>

            <div style="margin-bottom: 16px;">
                <label for="patient-phone">
                    <strong>Phone</strong>
                </label>

                <input
                    type="tel"
                    id="patient-phone"
                    placeholder="Optional"
                    style="
                        display: block;
                        width: 100%;
                        min-height: 48px;
                        margin-top: 6px;
                        padding: 10px;
                        font-size: 16px;
                        box-sizing: border-box;
                    "
                >
            </div>

            <div style="margin-bottom: 16px;">
                <label for="patient-address">
                    <strong>Address</strong>
                </label>

                <input
                    type="text"
                    id="patient-address"
                    placeholder="Optional"
                    style="
                        display: block;
                        width: 100%;
                        min-height: 48px;
                        margin-top: 6px;
                        padding: 10px;
                        font-size: 16px;
                        box-sizing: border-box;
                    "
                >
            </div>

            <div style="
                display: flex;
                gap: 12px;
                flex-wrap: wrap;
            ">

                <button
                    type="submit"
                    class="large-button"
                    id="save-patient-button"
                >
                    Create Patient
                </button>

                <button
                    type="button"
                    class="large-button"
                    id="cancel-edit-button"
                    style="display: none;"
                >
                    Cancel Edit
                </button>

            </div>

        </form>

        <hr style="margin: 28px 0;">

        <h3>Patients from Backend</h3>

        <div id="patient-list">
            Loading patients...
        </div>
    `;

    patientSection.appendChild(managementContainer);

    const form = document.getElementById("patient-form");

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        await savePatient(api);
    });

    const cancelButton =
        document.getElementById("cancel-edit-button");

    cancelButton.addEventListener("click", () => {
        resetPatientForm();
    });
}


/* =========================================================
   Load Patients
   ========================================================= */

async function loadPatients(api) {
    const patientList = document.getElementById("patient-list");

    if (!patientList) {
        return;
    }

    patientList.innerHTML = "Loading patients...";

    showPatientStatus("Loading patients...", "loading");

    try {
        const patients = await api.getPatients();

        renderPatients(patients);

        showPatientStatus(
            "Patients loaded successfully.",
            "success"
        );
    } catch (error) {
        console.error(error);

        patientList.innerHTML =
            "<p>Unable to load patients.</p>";

        showPatientStatus(
            getReadableError(error),
            "error"
        );
    }
}


/* =========================================================
   Render Patients
   ========================================================= */

function renderPatients(patients) {
    const patientList = document.getElementById("patient-list");

    if (!patientList) {
        return;
    }

    if (!Array.isArray(patients) || patients.length === 0) {
        patientList.innerHTML = `
            <p>No patients found.</p>
        `;

        return;
    }

    patientList.innerHTML = "";

    patients.forEach((patient) => {
        const card = document.createElement("div");

        card.className = "card";

        card.style.marginTop = "16px";

        card.innerHTML = `
            <h3>${escapeHtml(patient.name || "Unnamed Patient")}</h3>

            <p>
                <strong>ID:</strong>
                ${patient.id ?? "N/A"}
            </p>

            <p>
                <strong>Date of Birth:</strong>
                ${patient.dateOfBirth || "Not provided"}
            </p>

            <p>
                <strong>Phone:</strong>
                ${patient.phone || "Not provided"}
            </p>

            <p>
                <strong>Address:</strong>
                ${patient.address || "Not provided"}
            </p>

            <p>
                <strong>Caregiver ID:</strong>
                ${patient.caregiverId ?? "Not assigned"}
            </p>

            <div style="
                display: flex;
                gap: 10px;
                flex-wrap: wrap;
                margin-top: 16px;
            ">

                <button
                    type="button"
                    class="large-button edit-patient-button"
                    data-id="${patient.id}"
                >
                    Edit
                </button>

                <button
                    type="button"
                    class="large-button delete-patient-button"
                    data-id="${patient.id}"
                >
                    Delete
                </button>

            </div>
        `;

        patientList.appendChild(card);
    });

    attachPatientActionListeners();
}


/* =========================================================
   Edit / Delete Buttons
   ========================================================= */

function attachPatientActionListeners() {
    const editButtons =
        document.querySelectorAll(".edit-patient-button");

    const deleteButtons =
        document.querySelectorAll(".delete-patient-button");

    editButtons.forEach((button) => {
        button.addEventListener("click", async () => {
            const patientId = Number(button.dataset.id);

            await startPatientEdit(patientId);
        });
    });

    deleteButtons.forEach((button) => {
        button.addEventListener("click", async () => {
            const patientId = Number(button.dataset.id);

            await deletePatientFromBackend(patientId);
        });
    });
}


/* =========================================================
   Create / Update
   ========================================================= */

async function savePatient(api) {
    const id =
        document.getElementById("patient-id").value.trim();

    const name =
        document.getElementById("patient-name").value.trim();

    const caregiverIdValue =
        document.getElementById("patient-caregiver-id").value.trim();

    const dateOfBirth =
        document.getElementById("patient-date-of-birth").value;

    const phone =
        document.getElementById("patient-phone").value.trim();

    const address =
        document.getElementById("patient-address").value.trim();

    if (!name) {
        showPatientStatus(
            "Patient name is required.",
            "error"
        );

        return;
    }

    const patient = {
        caregiverId: caregiverIdValue
            ? Number(caregiverIdValue)
            : null,

        name: name,

        dateOfBirth: dateOfBirth || null,

        phone: phone || null,

        address: address || null
    };

    const saveButton =
        document.getElementById("save-patient-button");

    saveButton.disabled = true;

    saveButton.textContent =
        id ? "Updating..." : "Creating...";

    showPatientStatus(
        id ? "Updating patient..." : "Creating patient...",
        "loading"
    );

    try {
        if (id) {
            await api.updatePatient(Number(id), patient);

            showPatientStatus(
                "Patient updated successfully.",
                "success"
            );
        } else {
            await api.createPatient(patient);

            showPatientStatus(
                "Patient created successfully.",
                "success"
            );
        }

        resetPatientForm();

        await loadPatients(api);

    } catch (error) {
        console.error(error);

        showPatientStatus(
            getReadableError(error),
            "error"
        );
    } finally {
        saveButton.disabled = false;
    }
}


/* =========================================================
   Start Editing
   ========================================================= */

async function startPatientEdit(patientId) {
    try {
        const api = await import("./api.js");

        showPatientStatus(
            "Loading patient...",
            "loading"
        );

        const patient =
            await api.getPatient(patientId);

        document.getElementById("patient-id").value =
            patient.id ?? "";

        document.getElementById("patient-name").value =
            patient.name ?? "";

        document.getElementById("patient-caregiver-id").value =
            patient.caregiverId ?? "";

        document.getElementById("patient-date-of-birth").value =
            patient.dateOfBirth ?? "";

        document.getElementById("patient-phone").value =
            patient.phone ?? "";

        document.getElementById("patient-address").value =
            patient.address ?? "";

        document.getElementById("save-patient-button").textContent =
            "Update Patient";

        document.getElementById("cancel-edit-button").style.display =
            "inline-block";

        showPatientStatus(
            "Patient loaded for editing.",
            "success"
        );

    } catch (error) {
        console.error(error);

        showPatientStatus(
            getReadableError(error),
            "error"
        );
    }
}


/* =========================================================
   Delete
   ========================================================= */

async function deletePatientFromBackend(patientId) {
    const confirmed = window.confirm(
        "Are you sure you want to delete this patient?"
    );

    if (!confirmed) {
        return;
    }

    try {
        const api = await import("./api.js");

        showPatientStatus(
            "Deleting patient...",
            "loading"
        );

        await api.deletePatient(patientId);

        showPatientStatus(
            "Patient deleted successfully.",
            "success"
        );

        resetPatientForm();

        await loadPatients(api);

    } catch (error) {
        console.error(error);

        showPatientStatus(
            getReadableError(error),
            "error"
        );
    }
}


/* =========================================================
   Form Reset
   ========================================================= */

function resetPatientForm() {
    const form = document.getElementById("patient-form");

    if (form) {
        form.reset();
    }

    document.getElementById("patient-id").value = "";

    document.getElementById("save-patient-button").textContent =
        "Create Patient";

    document.getElementById("cancel-edit-button").style.display =
        "none";
}


/* =========================================================
   Status Messages
   ========================================================= */

function showPatientStatus(message, type) {
    const status =
        document.getElementById("patient-api-status");

    if (!status) {
        return;
    }

    status.textContent = message;

    if (type === "loading") {
        status.setAttribute("aria-live", "polite");
    } else if (type === "success") {
        status.setAttribute("aria-live", "polite");
    } else {
        status.setAttribute("aria-live", "assertive");
    }
}


/* =========================================================
   Error Handling
   ========================================================= */

function getReadableError(error) {
    if (!error) {
        return "Something went wrong.";
    }

    if (error instanceof TypeError) {
        return "Could not connect to the backend. Make sure Spring Boot is running on http://localhost:8080.";
    }

    return error.message || "Something went wrong.";
}


/* =========================================================
   Basic HTML Safety
   ========================================================= */

function escapeHtml(value) {
    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}