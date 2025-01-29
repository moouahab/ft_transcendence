export default function ConnectView() {
  const form = document.getElementById("loginForm");
  const responseElement = document.getElementById("response");

  // 1. Fonction pour afficher des messages stylés (similaire au signup)
  function showMessage(message, type, duration = 3000) {
    // Définir le contenu et la classe
    responseElement.textContent = message;
    responseElement.className = ""; // Réinitialise toutes les classes
    responseElement.classList.add(type); // success, error, info, etc.

    // Afficher le message
    responseElement.style.display = "block";
    responseElement.style.opacity = "1";

    // Masquer automatiquement après un certain délai
    setTimeout(() => {
      responseElement.style.opacity = "0";
      setTimeout(() => {
        responseElement.style.display = "none";
      }, 500);
    }, duration);
  }

  // 2. Écouteur de l'événement submit
  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const data = { email, password };

    // 3. Appel fetch pour se connecter
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
          // Erreur si la réponse n'est pas en JSON
          throw new Error(
            "Erreur de parsing JSON: " +
              parseError.message +
              "\nRéponse brute: " +
              text
          );
        }

        // Gère les statuts d'erreur HTTP
        if (!response.ok) {
          if (response.status === 401) {
            // 401 => Identifiants invalides
            throw new Error("Identifiant ou mot de passe invalide");
          } else {
            // Autres erreurs
            throw new Error(jsonData.message || "Une erreur est survenue");
          }
        }

        // Si ok, on renvoie les données pour la suite
        return jsonData;
      })
      .then((data) => {
        // 4. Gestion de la 2FA ou non
        // Si on a des tokens => pas de 2FA => "Connexion réussie"
        if (data.access_token && data.refresh_token) {
          showMessage("Connexion réussie !", "success");

          // Redirige après un petit délai pour que l'utilisateur voie le message
          setTimeout(() => {
            window.location.hash = "#dashboard";
          }, 800);

        } else {
          // Pas de tokens => 2FA activée => affiche un message puis redirige
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
        // 5. Affiche l'erreur dans un style "error"
        showMessage(error.message, "error");
      });
  });
}
