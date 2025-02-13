export default function navbarOvs() {
    const sidebar = document.getElementById("sidebar");
    const openBtn = document.getElementById("openSidebarBtn");
    const closeBtn = document.getElementById("closeSidebarBtn");

    console.log("Navbar script chargé.");

    if (!sidebar || !openBtn || !closeBtn) {
        console.error("Erreur : Un élément de la navbar est introuvable.");
        return ;
    }
    openBtn.addEventListener("click", () => {
        sidebar.classList.add("open");
    });

    closeBtn.addEventListener("click", () => {
        sidebar.classList.remove("open");
    });
    document.addEventListener("click", (event) => {
        if (!sidebar.contains(event.target) && event.target !== openBtn) {
            sidebar.classList.remove("open");
        }
    });
}
