import AuthService from "../authService.js";

export default function ConnectView() {
  const form = document.getElementById("loginForm");
  const responseElement = document.getElementById("response");

  function showMessage(message, type, duration = 3000) {
    responseElement.textContent = message;
    responseElement.className = "";
    responseElement.classList.add(type);
    responseElement.style.display = "block";
    responseElement.style.opacity = "1";

    setTimeout(() => {
      responseElement.style.opacity = "0";
      setTimeout(() => {
        responseElement.style.display = "none";
      }, 500);
    }, duration);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const data = { email, password };

    fetch("https://localhost/api/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        let jsonData;
        try {
          jsonData = await response.json();
        } catch (parseError) {
          const text = await response.text();
          throw new Error(
            "Erreur de parsing JSON: " +
              parseError.message +
              "\\nRéponse brute: " +
              text
          );
        }

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Identifiant ou mot de passe invalide");
          } else {
            throw new Error(jsonData.message || "Une erreur est survenue");
          }
        }

        return jsonData;
      })
      .then((data) => {
        if (data.access_token && data.refresh_token) {
          showMessage("Connexion réussie !", "success");

          setTimeout(() => {
            window.location.hash = "#dashboard";
          }, 800);
          AuthService.startAutoRefresh();
        } else {
          showMessage(
            "Identifiants validés, un code OTP a été envoyé par email.",
            "info"
          );

          setTimeout(() => {
            window.location.hash = "#otp";
          }, 1200);
        }
      })
      .catch((error) => {
        showMessage(error.message, "error");
      });
  });
}
