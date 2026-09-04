import { login, loginPatient, registerCaregiver } from "./api.js";

document.addEventListener("DOMContentLoaded", () => {

    const loginForm =
        document.getElementById("login-form");

    if (!loginForm) {
        return;
    }

    loginForm.addEventListener(
        "submit",
        handleLogin
    );

    const registerForm = document.getElementById("register-form");
    registerForm?.addEventListener("submit", handleRegistration);
});


async function handleLogin(event) {

    event.preventDefault();

    const identifier =
        document.getElementById("identifier")
            .value
            .trim();

    const password =
        document.getElementById("password")
            .value;

    const role = document.getElementById("login-role").value;

    const button =
        document.getElementById("login-button");

    setLoginStatus(
        "Signing in...",
        "loading"
    );

    button.disabled = true;
    button.textContent = "Signing in...";

    try {

        if (role === "patient") {
            await loginPatient(identifier, password);
        } else {
            await login(identifier, password);
        }

        setLoginStatus(
            "Login successful. Opening dashboard...",
            "success"
        );

        window.location.href = role === "patient" ? "patient.html" : "index.html";

    } catch (error) {

        console.error(error);

        setLoginStatus(
            error.message ||
            "Unable to login.",
            "error"
        );

    } finally {

        button.disabled = false;
        button.textContent = "Login";
    }
}


function setLoginStatus(message, type) {

    const status =
        document.getElementById(
            "login-status"
        );

    if (!status) {
        return;
    }

    status.textContent = message;
    status.dataset.status = type;
}

async function handleRegistration(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const caregiver = Object.fromEntries(new FormData(form).entries());
    setLoginStatus("Creating your account...", "loading");
    try {
        await registerCaregiver(caregiver);
        window.location.href = "index.html";
    } catch (error) {
        setLoginStatus(error.message || "Unable to create account.", "error");
    }
}
