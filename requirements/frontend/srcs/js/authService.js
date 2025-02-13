export default class AuthService {
    static API_REFRESH_URL = "https://localhost/api/api/refresh-token/";
    static API_CHECK_URL = "https://localhost/api/api/check-token/";

    // Vérifier si l'utilisateur est connecté
    static async isAuthenticated() {
        try {
            const response = await fetch(AuthService.API_CHECK_URL, {
                method: "GET",
                credentials: "include",
            });

            const data = await response.json();
            return data.message === "Token valide.";
        } catch (error) {
            console.error("Erreur lors de la vérification du token :", error);
            return false;
        }
    }

    // Rafraîchir l'Access Token
    static async refreshAccessToken() {
        try {
            const response = await fetch(AuthService.API_REFRESH_URL, {
                method: "POST",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error("Échec du rafraîchissement du token");
            }

            console.log("Access Token rafraîchi !");
            return true;
        } catch (error) {
            console.warn("Impossible de rafraîchir le token :", error);
            return false;
        }
    }

    // Vérifier la session et rediriger si nécessaire
    static async ensureSession() {
        const isAuthenticated = await AuthService.isAuthenticated();
        if (!isAuthenticated) {
            console.warn("Session expirée, redirection vers connexion...");
            window.location.hash = "#connect"; // Redirection vers la page de connexion
        }
    }

    // Lancer l'auto-refresh toutes les 15 minutes
    static startAutoRefresh() {
        setInterval(AuthService.refreshAccessToken, 15 * 60 * 1000);
    }
}
