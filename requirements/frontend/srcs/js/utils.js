export async function fetchTemplate(path) {
    // await new Promise((resolve) => setTimeout(resolve, ));
    const response = await fetch(path);
    if (!response.ok) {
        throw new Error(`Erreur : impossible de charger le fichier ${path}`);
    }
    return await response.text();
}


export function showLoader() {
    document.getElementById("loader").style.display = "flex";
}

export function hideLoader() {
    document.getElementById("loader").style.display = "none";
}
