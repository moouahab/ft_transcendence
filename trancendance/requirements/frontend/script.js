function showSection(sectionId) {
    // Masquer toutes les sections
    const sections = ['seConnecter', 'opt','connexion', 'choix', 'choix-jeu', 'choix-compte', 'choix-PONG', 'choix-player', 'choix-ia', 'choix-tournois', 'match-display', 'choix-morpion', 'game-morpion'];
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


const form = document.getElementById('signupForm');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    // Récupération des données du formulaire
    const pseudo = form.querySelector('input[name="pseudo"]').value;
    const email = form.querySelector('input[name="email"]').value;
    const password = form.querySelector('input[name="password"]').value;
    const confirmPassword = form.querySelector('input[name="confirm_password"]').value;

    // Construction de l'objet à envoyer (mapping pseudo -> username)
    const data = { username: pseudo, email: email, password: password, confirm_password: confirmPassword
    };

    try {
      const response = await fetch('https://localhost:3000/api/api/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', 
        body: JSON.stringify(data)
      });

      if (response.ok)
        {
        const result = await response.json();
        localStorage.setItem('username', result.username);
        console.log('Succès :', result.username);
        alert(result.message);
        showSection('choix');
      } else {
        const errorData = await response.json();
        console.error('Erreur :', errorData);
        alert(errorData.message || 'Une erreur est survenue lors de la création du compte.');
      }
    } catch (error) {
      console.error('Erreur inattendue :', error);
      alert('Erreur inattendue. Vérifie ta connexion ou contacte l’admin.');
    }
});

document.getElementById('42LoginButton').addEventListener('click', () => {
    // Rediriger l'utilisateur vers l'URL de connexion OAuth de 42
    const clientId = 'u-s4t2ud-7b376fa04eb4dbbae0a22f639c617337b61b1f36f74e8d66d01cfa8881b51821';
    const redirectUri = 'https://localhost:3000/api/api/auth42/';
    const authUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;

    window.location.href = authUrl;  // Redirect to 42 OAuth authorization
});

document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    // Récupération des données du formulaire
    const email = event.target.querySelector('input[name="email"]').value;
    const password = event.target.querySelector('input[name="password"]').value;
    console.log(email, password);
  
    // Création de l'objet de connexion
    const data = { email: email, password: password };
  
    try {
      const response = await fetch('https://localhost:3000/api/api/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data)
      });
  
      const result = await response.json();
  
      if (response.ok) {
        // Si le backend renvoie des tokens, c'est que l'utilisateur n'a pas activé la 2FA
        if (result.access_token) {
          localStorage.setItem('username', result.username);
          alert('Connexion réussie !');
          showSection('choix');
        }
        // Sinon, on considère que la 2FA est activée et qu'un OTP a été envoyé
        else if (result.message && result.message.includes('OTP')) {
          // On peut pré-remplir l'email dans le formulaire OTP si besoin
          document.getElementById('otpEmail').value = email;
          alert(result.message);
          showSection('opt');
        } else {
          // Dans le cas contraire, on affiche le message du backend
          console.log(result.message);
          alert(result.message);
        }
      } else {
        console.error('Erreur de connexion :', result);
        alert(result.message || 'Identifiants incorrects.');
      }
    } catch (error) {
      console.error('Erreur inattendue :', error);
      alert('Erreur inattendue. Vérifie ta connexion ou contacte l’admin.');
    }
  });
  


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
    showSection('seConnecter');
}

document.getElementById('button-jeu').addEventListener('click', function() {
    showSection('choix-jeu'); // Afficher la section du jeu
});

document.getElementById('button-compte').addEventListener('click', function() {
    showSection('choix-compte'); // Afficher la section du compte
});

document.getElementById('logoutButton').addEventListener('click', function() {
    if (isUserAuthenticated())
        init();// Afficher la section du compte
});

document.getElementById('opt').addEventListener('click', function() {
    OTPView();
});




document.addEventListener("DOMContentLoaded", () =>
{
    const infoCompte = document.getElementById("first");
    const avatarImage = document.getElementById('avatar-image');

    // Charger le pseudonyme depuis localStorage
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
        infoCompte.innerHTML = savedUsername; // Mettre à jour l'élément avec le pseudo sauvegardé
    }

    // Charger l'avatar depuis localStorage
    const savedAvatar = localStorage.getItem('avatar');
    if (savedAvatar) {
        avatarImage.src = savedAvatar; // Mettre à jour l'image de l'avatar avec l'avatar sauvegardé
    }

    // Charger les victoires et défaites pour Pong
    const savedWinsPong = localStorage.getItem('matchWinsPong');
    const savedLossesPong = localStorage.getItem('matchLossesPong');

    if (savedWinsPong) {
        matchWinsPong = parseInt(savedWinsPong);
        document.getElementById('match-win-pong').textContent = matchWinsPong;
    }

    if (savedLossesPong) {
        matchLossesPong = parseInt(savedLossesPong);
        document.getElementById('match-loss-pong').textContent = matchLossesPong;
    }

    // Charger les victoires et défaites pour Morpion
    const savedWinsMorpion = localStorage.getItem('matchWinsMorpion');
    const savedLossesMorpion = localStorage.getItem('matchLossesMorpion');

    if (savedWinsMorpion) {
        matchWinsMorpion = parseInt(savedWinsMorpion);
        document.getElementById('match-win-morpion').textContent = matchWinsMorpion;
    }

    if (savedLossesMorpion) {
        matchLossesMorpion = parseInt(savedLossesMorpion);
        document.getElementById('match-loss-morpion').textContent = matchLossesMorpion;
    }

    // Initialiser les couleurs
    updateMatchColors();
    updateMatchColorsMorpion();

    if (window.location.hash === "#choix-PONG")
    {
        initPongGame();
    }
});

document.getElementById('save-account').addEventListener('click', function(event) {
    event.preventDefault(); // Empêcher la soumission du formulaire

    const avatarImage = document.getElementById('avatar-image');
    const avatarUpload = document.getElementById('avatar-upload');
    const usernameInput = document.getElementById('username');
    const pseudonymeElement = document.getElementById('first');

    const username = usernameInput.value.trim(); // Récupérer la valeur du pseudo depuis l'input

    // Vérifier si un pseudo est saisi
    if (username)
    {
        pseudonymeElement.textContent = username;
        localStorage.setItem('username', username);; // Mettre à jour le pseudonyme affiché
    } else {
        alert("Veuillez entrer un pseudonyme !"); // Message d'erreur si aucun pseudo n'est saisi
    }

    // Vérifier si un avatar est sélectionné
    const file = avatarUpload.files[0];
    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            avatarImage.src = e.target.result; // Mettre à jour l'image de l'avatar avec la nouvelle image

            localStorage.setItem('avatar', e.target.result);
        };

        reader.readAsDataURL(file); // Lire le fichier image comme Data URL
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

// Déclaration des variables pour le support de langue
let currentLang = localStorage.getItem('language') || 'fr'; // Par défault: 'fr'
let translations = {};

// Gestion de la langue
document.addEventListener("DOMContentLoaded", () => {
    const languageSelector = document.getElementById("language-selector");
  
    // Récupérer les traductions depuis le fichier JSON
    fetch("translations.json")
        .then(response => response.json())
        .then(data => {
            translations = data; // Sauvegarde de translations dans la variable globale
            applyTranslations(translations, currentLang); // Appliquer les traductions immédiatement
  
            // Définir le dropdown sur la langue actuelle
            languageSelector.value = currentLang;
  
            // Gérer le changement de langue lorsque le dropdown est mis à jour
            languageSelector.addEventListener("change", (event) => {
                currentLang = event.target.value; // Mettre à jour la langue actuelle
                localStorage.setItem("language", currentLang); // Enregistrer la préférence dans le localStorage
                applyTranslations(translations, currentLang); // Appliquer la langue sélectionnée
            });
        })
        .catch(error => console.error("Error loading translations:", error));
  });

// Fonction pour appliquer les traductions aux éléments avec des attributs data-i18n
function applyTranslations(translations, lang) {
    // Itérer sur tous les éléments avec l'attribut 'data-i18n'
    document.querySelectorAll("[data-i18n]").forEach((element) => {
        const key = element.getAttribute("data-i18n");

        // Vérifier si la traduction existe pour la langue actuelle et la clé
        if (translations[lang] && translations[lang][key]) {
            // Si l'élément est un champ input avec un placeholder, appliquer la traduction
            if (element.tagName.toLowerCase() === 'input' && element.hasAttribute("placeholder")) {
                element.placeholder = translations[lang][key]; // Appliquer la traduction au placeholder
            
            // Si l'élément est un bouton contenant un span.info-comment, traduire les deux parties
            } else if (element.tagName.toLowerCase() === 'button' && element.querySelector(".info-comment")) {
                const infoComment = element.querySelector(".info-comment"); // Récupérer le span
                
                const buttonKey = key; // Clé pour le texte principal du bouton
                const commentKey = infoComment.getAttribute("data-i18n"); // Clé pour le texte du span

                // Vérifier si une traduction existe pour le texte du span.info-comment
                if (translations[lang][commentKey]) {
                    infoComment.textContent = translations[lang][commentKey]; // Appliquer la traduction au span
                }

                // Appliquer la traduction au texte principal du bouton
                element.innerHTML = `${translations[lang][buttonKey]} <br><span class="info-comment" data-i18n="${commentKey}">${infoComment.textContent}</span>`;
            
            // Sinon, appliquer la traduction normalement
            } else {
                element.textContent = translations[lang][key];
            }
        }
    });
}

function init()  { 
    document.getElementById("logoutButton").addEventListener("click", function() {
        fetch("https://localhost:3000/api/api/logout/", {
            method: "POST",
            credentials: "include" // Assurez-vous d'inclure les cookies
        }).then(response => response.json())
        .then(data => {
            alert(data.message); // Affiche un message de déconnexion
            showSection('seConnecter');
        }).catch(error => console.error("Erreur lors de la déconnexion:", error));
    });
    ;
}

    async function isUserAuthenticated() {
    try {
      const response = await fetch("https://localhost:3000/api/api/check-token/", {
        method: "GET",
        credentials: "include",
      });
  
      if (response.ok) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Erreur lors de la vérification du token :", error);
      return false;
    }
  }
  

  let matchWinsPong = 0;
  let matchLossesPong = 0;
  
  let matchWinsMorpion = 0;
  let matchLossesMorpion = 0;
  
  // Fonction de mise à jour des couleurs pour Pong
  function updateMatchColors() {
      const winElement = document.getElementById('match-win-pong');
      const lossElement = document.getElementById('match-loss-pong');
      
      if (matchWinsPong > 0) {
          winElement.style.color = 'green';
      } else {
          winElement.style.color = 'white';
      }
  
      if (matchLossesPong > 0) {
          lossElement.style.color = 'red';
      } else {
          lossElement.style.color = 'white';
      }
  }
  
  // Fonction de mise à jour des matchs pour Pong
  function updateMatchHistory(type) {
      if (type === 'win') {
          matchWinsPong++;
          document.getElementById('match-win-pong').textContent = matchWinsPong;
      } else if (type === 'loss') {
          matchLossesPong++;
          document.getElementById('match-loss-pong').textContent = matchLossesPong;
      }
  
      updateMatchColors();
  }
  
  // Fonction de mise à jour des couleurs pour Morpion
  function updateMatchColorsMorpion() {
      const winElement = document.getElementById('match-win-morpion');
      const lossElement = document.getElementById('match-loss-morpion');
      
      if (matchWinsMorpion > 0) {
          winElement.style.color = 'green';
      } else {
          winElement.style.color = 'white';
      }
  
      if (matchLossesMorpion > 0) {
          lossElement.style.color = 'red';
      } else {
          lossElement.style.color = 'white';
      }
  }
  
  // Fonction de mise à jour des matchs pour Morpion
  function updateMatchHistoryMorpion(type) {
      if (type === 'win') {
          matchWinsMorpion++;
          document.getElementById('match-win-morpion').textContent = matchWinsMorpion;
      } else if (type === 'loss') {
          matchLossesMorpion++;
          document.getElementById('match-loss-morpion').textContent = matchLossesMorpion;
      }
  
      updateMatchColorsMorpion();
  }
  
  // Sauvegarder les données des matchs dans le localStorage
  function saveMatchData() {
      localStorage.setItem('matchWinsPong', matchWinsPong);
      localStorage.setItem('matchLossesPong', matchLossesPong);
      localStorage.setItem('matchWinsMorpion', matchWinsMorpion);
      localStorage.setItem('matchLossesMorpion', matchLossesMorpion);
  }


function OTPView() {
    const form = document.getElementById('otpForm');
    const responseElement = document.getElementById("response");
  
    // 1. Fonction pour afficher des messages stylés (similaire au signup)
    function showMessage(message, type, duration = 3000) {
      // Définir le contenu et la classe
      responseElement.textContent = message;
      responseElement.className = ""; // Réinitialise toutes les classes
      responseElement.classList.add(type); // success, error, info, etc.
  
      // Afficher le message
      responseElement.style.display = "block";
      responseElement.style.opacity = "1";
  
      // Masquer automatiquement après un certain délai
      setTimeout(() => {
        responseElement.style.opacity = "0";
        setTimeout(() => {
          responseElement.style.display = "none";
        }, 500);
      }, duration);
    }
    
    form.addEventListener('submit', function(e) {
      e.preventDefault();
    
      const email = document.getElementById('otpEmail').value;
      const otp_code = document.getElementById('otpCode').value;
      const data = { email, otp_code };
    
      fetch('https://localhost:3000/api/api/verify-otp/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(data)
      })
      .then(async (response) => {
        const jsonData = await response.json();
        if (!response.ok) {
          throw new Error(jsonData.message || 'Erreur de vérification OTP');
        }
        return jsonData;
    })
    .then((data) => {
        showMessage(data.message || 'Connexion réussie !', 'success');
        showSection('choix');
      })
      .catch((error) => {
        console.error('Erreur OTP:', error);
        showMessage(error.message, 'error');
      });
    });
  }
