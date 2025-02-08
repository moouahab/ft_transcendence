// Fonction pour gérer l'affichage des sections en fonction de l'état
function showSection(sectionId)
{
    document.getElementById('connexion').style.display = 'none';
    document.getElementById('choix').style.display = 'none';
    document.getElementById('choix-jeu').style.display = 'none';
    document.getElementById('choix-compte').style.display = 'none';
    document.getElementById('choix-social').style.display = 'none';
    document.getElementById('choix-PONG').style.display = 'none';
    document.getElementById('choix-player').style.display = 'none';
    document.getElementById('choix-ia').style.display = 'none';

    document.getElementById(sectionId).style.display = 'block';

    history.pushState({ section: sectionId }, "", `#${sectionId}`);
}

// // Fonction de soumission du formulaire
// document.getElementById('formConnexion').addEventListener('submit', function(e) {
//     e.preventDefault(); // Empêche le rechargement de la page

//     const password = document.querySelector('input[name="password"]').value;
//     const confirmPassword = document.querySelector('input[name="confirm_password"]').value;

//     if (password === confirmPassword) {
//         // Masquer la section de connexion et afficher la section des choix
//         showSection('choix');
//     } else {
//         alert("Les mots de passe ne correspondent pas !");
//     }
// });


// Gérer les changements d'historique (par exemple, lorsque l'utilisateur utilise le bouton retour)
window.onpopstate = function(event) {
    if (event.state) {
        showSection(event.state.section);
    }
};

// Initialiser la page à la section appropriée selon l'URL
if (window.location.hash) {
    const section = window.location.hash.substring(1);
    showSection(section);
} else {
    showSection('connexion');
}

// Ajouter l'événement click pour le bouton "Pour aller plus vite"
document.getElementById('raccourcis').addEventListener('click', function() {
    showSection('choix');
});

document.getElementById('button-jeu').addEventListener('click', function() {
    showSection('choix-jeu'); // Afficher la section du jeu
});

document.getElementById('button-compte').addEventListener('click', function() {
    showSection('choix-compte'); // Afficher la section du compte
});

document.getElementById('button-social').addEventListener('click', function() {
    showSection('choix-social'); // Afficher la section du social
});
