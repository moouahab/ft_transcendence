import { isUserAuthenticated } from "./utils.js";
import { fetchTemplate } from "./utils.js";
import { showLoader, hideLoader } from "./utils.js";
import setupSignupView from "./views/signup.js";
import ConnectView from './views/connect.js';
import setupGalaxyView from "./3js/galaxy.js";

const app = document.getElementById("app");

const routes = {
  home: async () => {
    app.innerHTML = await fetchTemplate("./srcs/templates/home.html");
    setupGalaxyView();
  },
  connect: async () => {
    app.innerHTML = await fetchTemplate("./srcs/templates/connect.html");
    ConnectView(); // Appelle la logique spécifique
  },
  signup: async () => {
    app.innerHTML = await fetchTemplate("./srcs/templates/signup.html");
    setupSignupView();
  },
  notFound: () => "<h1>404 - Page non trouvée</h1>",
};

async function loadView(view) {
  showLoader();

  try {
    const isAuthenticated = await isUserAuthenticated();

    // Rediriger un utilisateur connecté qui essaie d'accéder à `#connect` ou `#signup`
    if (isAuthenticated && (view === "connect" || view === "signup")) {
      alert("Vous êtes déjà connecté !");
      window.location.hash = "#home";
      return;
    }

    // Rediriger un utilisateur non connecté qui essaie d'accéder à `#home` ou `#galaxy`
    if (!isAuthenticated && (view === "home" || view === "galaxy")) {
      alert("Vous devez être connecté pour accéder à cette page !");
      window.location.hash = "#connect";
      return;
    }
    // Charger la vue si aucune redirection
    const content = routes[view] ? await routes[view]() : routes["notFound"]();

  } catch (error) {
    console.error("Erreur lors du chargement de la vue :", error);
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
