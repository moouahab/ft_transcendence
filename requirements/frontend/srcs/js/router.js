import { isUserAuthenticated } from "./utils.js";
import { fetchTemplate } from "./utils.js";
import { showLoader, hideLoader } from "./utils.js";
import setupSignupView from "./views/signup.js";
import ConnectView from './views/connect.js';
import setupGalaxyView from "./3js/galaxy.js";

const app = document.getElementById("app");

const routes = {
  public: {
    connect: async () => {
      app.innerHTML = await fetchTemplate("./srcs/templates/connect.html");
      ConnectView();
    },
    signup: async () => {
      app.innerHTML = await fetchTemplate("./srcs/templates/signup.html");
      setupSignupView();
    },
    home: async () => {
      setupGalaxyView();
    },
    otp: async () => {
      app.innerHTML = await fetchTemplate("./srcs/templates/otp.html");
      const module = await import("./views/otp.js");
      module.default();
    },
  },
  protected: {
    dashboard: async () => {
      app.innerHTML = await fetchTemplate("./srcs/templates/dashboard.html");
    },
  },
  notFound: async () => {
    app.innerHTML = `<h1>404 - Page non trouvée</h1>`;
  },
};

export default routes;


async function loadView(view) {
  showLoader();

  try {
    const isAuthenticated = await isUserAuthenticated();

    // Routes publiques accessibles à tous
    if (routes.public[view]) {
      if (isAuthenticated && (view === "connect" || view === "signup")) {
        alert("Vous êtes déjà connecté !");
        window.location.hash = "#dashboard";
        return;
      }
      await routes.public[view](); // Charger la route publique
      return;
    }
    if (routes.protected[view]) {
      if (!isAuthenticated) {
        alert("Vous devez être connecté pour accéder à cette page !");
        window.location.hash = "#connect";
        return;
      }
      await routes.protected[view](); // Charger la route protégée
      return;
    }
    // Route non trouvée
    await routes.notFound();
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
