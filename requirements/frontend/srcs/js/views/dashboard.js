
export default function init()  { 
    document.getElementById("logoutButton").addEventListener("click", () => {
        fetch("https://localhost/api/api/logout/", {
        method: "POST",
        credentials: "include", // pour envoyer les cookies
        })
        .then(async (response) => {
            const data = await response.json();
            console.error(data);
            if (!response.ok) {
            throw new Error(data.message || "Erreur lors de la déconnexion");
            }
            // Déconnexion réussie : redirection ou message
            console.log("Déconnexion réussie :", data.message);
            window.location.hash = "#connect";
        })
        .catch((error) => {
            console.error("Erreur lors de la déconnexion :", error);
            alert(error.message);
        });
    });
}