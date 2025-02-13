import AuthService from "./authService.js";
import { isUserAuthenticated, fetchTemplate, showLoader, hideLoader } from "./utils.js";
import init from "./views/dashboard.js";
import navbarOvs from "./views/header.js";
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
      await AuthService.ensureSession(); // Vérifie l'authentification avant de charger
      app.innerHTML = await fetchTemplate("./srcs/templates/general/header.html");
      app.innerHTML += await fetchTemplate("./srcs/templates/dashboard.html");
      init();
      navbarOvs();
    },
  },
  notFound: async () => {
    app.innerHTML = `<h1>404 - Page non trouvée</h1>`;
  },
};

async function loadView(view) {
  showLoader();

  try {
    const isAuthenticated = await isUserAuthenticated();

    if (routes.public[view]) {
      if (isAuthenticated && (view === "connect" || view === "signup")) {
        alert("Vous êtes déjà connecté !");
        window.location.hash = "#dashboard";
        return;
      }
      await routes.public[view]();
      return;
    }

    if (routes.protected[view]) {
      if (!isAuthenticated) {
        alert("Vous devez être connecté pour accéder à cette page !");
        window.location.hash = "#connect";
        return;
      }
      await routes.protected[view]();
      return;
    }

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
