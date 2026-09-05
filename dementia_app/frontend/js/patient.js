import { getCurrentPatient, getPatientMedications, getPatientReminders, getPatientEmergencyContact, completeReminder, triggerEmergencyEvent, logout } from "./api.js";
import {
    initializeMemoryGame,
    initializeAttentionGame,
    initializeDailyRoutineRecallGame,
    initializePatternRecognitionGame
} from "./games.js";

document.addEventListener("DOMContentLoaded", initializePatientDashboard);

let emergencyContact = null;

async function initializePatientDashboard() {
    const status = document.getElementById("patient-status");
    try {
        const patient = await getCurrentPatient();
        if (!patient) {
            window.location.replace("login.html");
            return;
        }
        document.getElementById("patient-welcome").textContent = `${patient.name} · ${translate("patientPortal")}`;
        initializeMemoryGame(patient.id);
        initializeAttentionGame(patient.id);
        initializeDailyRoutineRecallGame(patient.id);
        initializePatternRecognitionGame(patient.id);
        await loadCarePlan(patient.id);
        initializeEmergencyHelp(patient.id);
        status.textContent = "Choose a game to begin.";
        status.dataset.status = "success";
        document.getElementById("patient-logout-button").addEventListener("click", async () => {
            try { await logout(); } finally { window.location.replace("login.html"); }
        });
    } catch (error) {
        status.textContent = error.message || "Unable to load activities. Please sign in again.";
        status.dataset.status = "error";
    }
}

async function loadCarePlan(patientId) {
    const [medications, reminders, contact] = await Promise.all([
        getPatientMedications(patientId), getPatientReminders(patientId),
        getPatientEmergencyContact(patientId).catch(() => null)
    ]);
    emergencyContact = contact;
    document.getElementById("patient-medications").innerHTML = medications.length
        ? medications.map(item => `<p><strong>${escapeHtml(item.name)}</strong><br>${escapeHtml(item.dosage || "")} · ${escapeHtml(item.frequency || "")}<br>${escapeHtml(item.instructions || "")}</p>`).join("")
        : "<p>No medications listed.</p>";
    const remindersBox = document.getElementById("patient-reminders");
    remindersBox.innerHTML = reminders.length
        ? reminders.map(item => `<p><strong>${escapeHtml(item.reminderTime || "")}</strong> ${escapeHtml(item.title)} — ${escapeHtml(item.status || "PENDING")} ${item.status === "COMPLETED" ? "" : `<button type="button" data-reminder-id="${item.id}">Mark done</button>`}</p>`).join("")
        : "<p>No reminders listed.</p>";
    remindersBox.querySelectorAll("[data-reminder-id]").forEach(button => button.addEventListener("click", async () => {
        button.disabled = true;
        try { await completeReminder(button.dataset.reminderId); await loadCarePlan(patientId); }
        catch (error) { button.disabled = false; alert(error.message || "Unable to update reminder."); }
    }));
    document.getElementById("patient-emergency-contact").innerHTML = contact
        ? `<p><strong>${escapeHtml(contact.name)}</strong><br>${escapeHtml(contact.relationship || "Emergency contact")}<br>${escapeHtml(contact.phone)}</p><a class="emergency-call-button" href="tel:${encodeURIComponent(contact.phone)}">${escapeHtml(translate("callContact"))}</a>`
        : "<p>No emergency contact has been added yet.</p>";
}

function initializeEmergencyHelp(patientId) {
    const button = document.getElementById("patient-emergency-button");
    const status = document.getElementById("patient-emergency-status");
    if (!button || button.dataset.bound) return;
    button.dataset.bound = "true";

    button.addEventListener("click", async () => {
        button.disabled = true;
        status.textContent = "Requesting emergency help…";
        try {
            await triggerEmergencyEvent(patientId, "Emergency assistance requested by the patient.");
            status.textContent = emergencyContact?.phone
                ? "Emergency help requested. Opening your emergency contact."
                : "Emergency help requested. Your care team has been notified.";
            status.className = "status-message success";
            if (emergencyContact?.phone) {
                window.location.href = `tel:${encodeURIComponent(emergencyContact.phone)}`;
            }
        } catch (error) {
            status.textContent = error.message || "Unable to request emergency help. Please call your local emergency number.";
            status.className = "status-message error";
        } finally {
            button.disabled = false;
        }
    });
}

function translate(key) {
    return window.CognicareI18n?.t(key) || key;
}

function escapeHtml(value) {
    return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
