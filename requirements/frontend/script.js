function showSection(sectionId) {
    // Masquer toutes les sections
    const sections = ['connexion', 'choix', 'choix-jeu', 'choix-compte', 'choix-social', 'choix-PONG', 'choix-player', 'choix-ia', 'choix-tournois', 'match-display', 'choix-morpion', 'game-morpion'];
    sections.forEach(section => {
        document.getElementById(section).style.display = 'none';
    });

    // Afficher la section demandée
    document.getElementById(sectionId).style.display = 'block';

    // Mettre à jour l'historique
    const currentUrl = window.location.href.split('#')[0]; // Récupère l'URL de base
    const newUrl = `${currentUrl}#${sectionId}`; // Crée une nouvelle URL avec le hash de la section

    if (window.location.hash !== `#${sectionId}`) {
        // Utiliser pushState pour ajouter l'état dans l'historique
        history.pushState({ section: sectionId }, "", newUrl);
    } else {
        // Si la section est déjà dans l'URL, utilisez replaceState
        history.replaceState({ section: sectionId }, "", newUrl);
    }
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

document.addEventListener("DOMContentLoaded", () =>
{
    if (window.location.hash === "#choix-PONG")
    {
        initPongGame();
    }
});

let players = [];
let matches = [];
let currentMatchIndex = 0;  // Index du match en cours

// Fonction pour démarrer le tournoi
function startTournament() {
    isTournament = true;

    // Récupération des joueurs
    players = [
        document.getElementById('player1').value.trim(),
        document.getElementById('player2').value.trim(),
        document.getElementById('player3').value.trim(),
        document.getElementById('player4').value.trim()
    ];

    // Vérification si tous les champs sont remplis
    if (players.some(player => player === "")) {
        alert("Tous les joueurs doivent avoir un nom!");
        return;
    }

    // Vérification que les noms des joueurs ne sont pas identiques
    if (new Set(players).size !== players.length) {
        alert("Les noms des joueurs doivent être uniques!");
        return;
    }

    // Mélanger les joueurs
    players = shuffle(players);

    // Créer les matchs initiaux
    matches = [
        { player1: players[0], player2: players[1], winner: null },
        { player1: players[2], player2: players[3], winner: null }
    ];

    // Afficher les matchs
    displayMatch();
}

// Fonction pour mélanger les joueurs
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));  // Génère un index aléatoire
        [array[i], array[j]] = [array[j], array[i]];    // Échange les éléments
    }
    return array;
}
// Fonction pour afficher les matchs
function displayMatch() {
    // Masquer la section des choix de tournoi
    document.getElementById('match-display').style.display = 'block';
    document.getElementById('choix-tournois').style.display = 'none';

    // Match 1
    if (matches[0].winner) {
        document.getElementById('match1-players').textContent = `${matches[0].winner} (Vainqueur)`;
    } else {
        document.getElementById('match1-players').textContent = `${matches[0].player1} vs ${matches[0].player2}`;
    }

    // Match 2
    if (matches[1].winner) {
        document.getElementById('match2-players').textContent = `${matches[1].winner} (Vainqueur)`;
    } else {
        document.getElementById('match2-players').textContent = `${matches[1].player1} vs ${matches[1].player2}`;
    }

    // Finale (mise à jour avec les gagnants)
    if (matches[0].winner && matches[1].winner) {
        // Vérifier si le troisième match existe avant d'y accéder
        if (matches[2] && matches[2].winner) {
            document.getElementById('final-players').textContent = `${matches[2].winner} (Vainqueur Final)`;
            document.getElementById('start-final').style.display = 'none'; // Masquer le bouton "Jouer" après la finale
        } else {
            document.getElementById('final-players').textContent = `${matches[0].winner} vs ${matches[1].winner}`;
            document.getElementById('start-final').style.display = 'inline';  // Afficher le bouton "Jouer" de la finale
        }
    } else {
        document.getElementById('final-players').textContent = 'En attente des gagnants';
        document.getElementById('start-final').style.display = 'none';  // Masquer le bouton tant que les gagnants ne sont pas connus
    }
}


// Fonction pour commencer un jeu Pong
function startPongGame(matchIndex) {
    currentMatchIndex = matchIndex;

    // Masquer l'affichage des matchs en cours
    document.getElementById('match-display').style.display = 'none';
    document.getElementById('choix-PONG').style.display = 'block';

    // Enlever le canvas si nécessaire
    const existingCanvas = document.getElementById('choix-PONG').querySelector('canvas');
    if (existingCanvas) {
        document.getElementById('choix-PONG').removeChild(existingCanvas);
    }

    // Initialiser le jeu Pong
    initPongGame();
}

function finishMatch(matchIndex, winner) {
    // Mettre à jour le gagnant du match
    if (winner == "Player 1") {
        winner = matches[matchIndex].player1;
    }
    if (winner == "Player 2") {
        winner = matches[matchIndex].player2;
    }
    matches[matchIndex].winner = winner;

    // Masquer le bouton "Jouer" du match terminé
    if (matchIndex == 2)
    {
        document.getElementById(`start-final`).style.display = 'none';
        document.getElementById(`return-button`).style.display = 'block';
    }
    else
    {
        document.getElementById(`start-match${matchIndex + 1}`).style.display = 'none';
    }

    // Vérifier si la finale peut être lancée
    if (matches[0].winner && matches[1].winner) {
        // Si la finale n'existe pas encore, la créer
        if (!matches[2]) {
            matches[2] = { player1: matches[0].winner, player2: matches[1].winner, winner: null };
        }

        // Mettre à jour l'affichage de la finale
        document.getElementById('final-players').textContent = `${matches[0].winner} vs ${matches[1].winner}`;
        document.getElementById('start-final').style.display = 'inline'; // Afficher le bouton pour démarrer la finale
    }

    // Rafraîchir l'affichage des matchs
    displayMatch();
}

// Exemple d'initialisation du jeu Pong
function initPongGame() {
    // Cette fonction va lancer le jeu Pong. Ici, il peut être lié à un code spécifique pour Pong.
    console.log('Le jeu Pong commence!');
}

// Fonction pour réinitialiser le tournoi
function resetTournament() {
    // Réinitialiser les variables du tournoi
    players = [];
    matches = [];
    currentMatchIndex = 0;  // Index du match en cours

    // Réinitialiser l'affichage
    document.getElementById('match-display').style.display = 'none';
    document.getElementById('choix-tournois').style.display = 'block';  // Afficher la sélection du tournoi
    document.getElementById('final-players').textContent = '';
    document.getElementById('start-final').style.display = 'none';
    document.getElementById('return-button').style.display = 'none';
    document.getElementById(`start-match1`).style.display = 'block';
    document.getElementById(`start-match2`).style.display = 'block';

    // Remettre les champs des joueurs à zéro
    document.getElementById('player1').value = '';
    document.getElementById('player2').value = '';
    document.getElementById('player3').value = '';
    document.getElementById('player4').value = '';
    isTournament = false;
}

// Fonction pour revenir au menu principal et réinitialiser le tournoi
function goBackToMenu() {
    resetTournament();  // Réinitialiser le tournoi
}