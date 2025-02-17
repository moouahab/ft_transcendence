let currentPlayer = 'X';  // Le premier joueur est X
let board = ['', '', '', '', '', '', '', '', ''];  // Le tableau qui représente l'état du jeu
let gameOver = false;  // Variable pour savoir si le jeu est terminé

// Fonction pour démarrer le jeu
function startMorpion() {
  // Affiche la zone du jeu et masque la section de choix
  document.getElementById('morpion-retour').style.display = 'none';
  showSection('game-morpion');
  
  // Réinitialise l'état du jeu
  currentPlayer = 'X';
  board = ['', '', '', '', '', '', '', '', ''];
  gameOver = false;

  // Effacer l'affichage des symboles et rendre les cases cliquables
  document.querySelectorAll('.cell').forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('disabled');
    cell.addEventListener('click', handleClick);  // Ajouter un événement pour chaque case
  });
}

// Fonction pour gérer les clics sur les cases
function handleClick(event) {
  const index = event.target.dataset.index;

  if (board[index] !== '' || gameOver) return;  // Si la case est déjà occupée ou si le jeu est fini, rien faire

  // Place le symbole du joueur actuel dans la case
  board[index] = currentPlayer;
  event.target.textContent = currentPlayer;

  // Vérifier si un joueur a gagné
  checkWinner();

  // Changer de joueur
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

// Fonction pour vérifier si un joueur a gagné
function checkWinner() {
  const winningCombos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let combo of winningCombos) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      gameOver = true;
      // Déterminer le gagnant et mettre à jour l'historique
      if (currentPlayer === 'X') {
        alert('X a gagné !');
        updateMatchHistoryMorpion('win'); // Met à jour les victoires de X
        saveMatchData();
      } else {
        alert('O a gagné !');
        updateMatchHistoryMorpion('loss'); // Met à jour les défaites de X
        saveMatchData();
      }
      document.getElementById(`morpion-retour`).style.display = 'block';
      return;
    }
  }

  // Vérifie si le jeu est un match nul (toutes les cases sont remplies)
  if (board.every(cell => cell !== '')) {
    gameOver = true;
    alert('Match nul !');
  }
}

// Ajouter des écouteurs d'événements pour les boutons
document.getElementById('button-startMorpion').addEventListener('click', startMorpion);
