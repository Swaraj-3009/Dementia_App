import { getCurrentPatient, getPatientMedications, getPatientReminders, getPatientEmergencyContact, completeReminder, logout } from "./api.js";
import {
    initializeMemoryGame,
    initializeAttentionGame,
    initializeDailyRoutineRecallGame,
    initializePatternRecognitionGame
} from "./games.js";

document.addEventListener("DOMContentLoaded", initializePatientDashboard);

async function initializePatientDashboard() {
    const status = document.getElementById("patient-status");
    try {
        const patient = await getCurrentPatient();
        if (!patient) {
            window.location.replace("login.html");
            return;
        }
        document.getElementById("patient-welcome").textContent = `${patient.name}'s Activities`;
        initializeMemoryGame(patient.id);
        initializeAttentionGame(patient.id);
        initializeDailyRoutineRecallGame(patient.id);
        initializePatternRecognitionGame(patient.id);
        await loadCarePlan(patient.id);
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
        ? `<p><strong>${escapeHtml(contact.name)}</strong><br>${escapeHtml(contact.relationship || "Emergency contact")}<br><a href="tel:${encodeURIComponent(contact.phone)}">${escapeHtml(contact.phone)}</a></p>`
        : "<p>No emergency contact has been added yet.</p>";
}

function escapeHtml(value) {
    return String(value ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
