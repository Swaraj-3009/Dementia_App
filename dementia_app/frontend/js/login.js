const API_BASE_URL = "http://localhost:8080";

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

        const response =
            await fetch(
                `${API_BASE_URL}/api/auth/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    credentials: "include",

                    body: JSON.stringify({
                        identifier,
                        password
                    })
                }
            );

        const contentType =
            response.headers.get(
                "content-type"
            ) || "";

        let data;

        if (contentType.includes("application/json")) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        if (!response.ok) {
            throw new Error(
                typeof data === "string"
                    ? data
                    : "Login failed."
            );
        }

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