export async function fetchTemplate(path) {
    // await new Promise((resolve) => setTimeout(resolve, ));
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`Erreur : impossible de charger le fichier ${path}`);
    }
    else
        return await response.text();
}


export function showLoader() {
    document.getElementById("loader").style.display = "flex";
}

export function hideLoader() {
    document.getElementById("loader").style.display = "none";
}


export async function isUserAuthenticated() {
    try {
      const response = await fetch("https://localhost/api/api/check-token/", {
        method: "GET",
        credentials: "include",
      });
  
      if (response.ok) {
        return true; // Utilisateur connecté
      } else {
        return false; // Utilisateur non connecté
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du token :", error);
      return false;
    }
  }
  