import { login } from "./api.js";

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

    const button =
        document.getElementById("login-button");

    setLoginStatus(
        "Signing in...",
        "loading"
    );

    button.disabled = true;
    button.textContent = "Signing in...";

    try {

        await login(identifier, password);

        setLoginStatus(
            "Login successful. Opening dashboard...",
            "success"
        );

        window.location.href =
            "index.html";

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
