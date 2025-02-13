import AuthService from "./authService.js";
import './router.js';

// Vérifier la session dès le chargement
document.addEventListener("DOMContentLoaded", async () => {
    await AuthService.ensureSession();
    AuthService.startAutoRefresh(); // Active le rafraîchissement automatique des tokens
});
