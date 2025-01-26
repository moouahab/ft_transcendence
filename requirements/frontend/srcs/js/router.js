import { fetchTemplate } from "./utils.js";
import { showLoader, hideLoader } from "./utils.js";
import setupSignupView from "./views/signup.js"; // Import de la logique spécifique

const app = document.getElementById("app");

const routes = {
  home: async () => await fetchTemplate("./srcs/templates/home.html"),
  connect: async () => await fetchTemplate("./srcs/templates/connect.html"),
  signup: async () => {
    const html = await fetchTemplate("./srcs/templates/signup.html");
    app.innerHTML = html; // Charger le HTML dans le DOM
    setupSignupView(); // Appeler la logique spécifique à la vue
  },
  notFound: () => "<h1>404 - Page non trouvée</h1>",
};

async function loadView(view) {
  showLoader();
  try {
    const content = routes[view] ? await routes[view]() : routes["notFound"]();
    if (view !== "signup") app.innerHTML = content; // Si pas signup, pas de JS spécial
  } catch (error) {
    console.error(error);
    app.innerHTML = `<h1>Erreur de chargement</h1>`;
  } finally {
    hideLoader();
  }
}

window.addEventListener("hashchange", () => {
  const view = window.location.hash.replace("#", "") || "home";
  loadView(view);
});

const defaultView = window.location.hash.replace("#", "") || "home";
loadView(defaultView);
