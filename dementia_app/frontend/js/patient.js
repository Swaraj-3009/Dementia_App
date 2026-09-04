import { getCurrentPatient, logout } from "./api.js";
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
