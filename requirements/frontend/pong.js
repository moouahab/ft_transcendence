let ia = false;  // Variable pour activer/désactiver l'IA
let iaErrorProbability = 0.2; // 50% de chance de rater
let lastIaUpdate = Date.now();
let speedFactor = 5; // Facteur pour compenser le délai
var isTournament = false; // Indique si un tournoi est en cours

function initPongGame() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    // Utilisation de la section #choix-PONG pour le rendu
    renderer.setSize(window.innerWidth / 2, window.innerHeight / 2);
    
    // Définir un fond bleu pour la scène
    scene.background = new THREE.Color(0x161a22); // Bleu

    const loader = new THREE.TextureLoader();
    loader.load('textures/stardust.png', function(texture) {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);

        // Création du matériau avec transparence
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true, // Active la transparence si l'image a un fond noir
        });

        // Création du plan qui affichera la texture
        const geometry = new THREE.PlaneGeometry(20, 20);
        const background = new THREE.Mesh(geometry, material);
        background.position.set(0, 0, -10); // Place le plan en arrière-plan
        scene.add(background);
    });

    let gameOver = false; // Variable pour stopper le jeu une seule fois

    // Trouver la section PONG et y ajouter le renderer
    const pongSection = document.getElementById('choix-PONG');
    pongSection.appendChild(renderer.domElement);

    // Position de la caméra (légèrement inclinée pour une meilleure vue)
    // camera.position.set(0, 6, 10);
    camera.position.set(0, 10, 0);
    camera.lookAt(0, 0, 0);

    // Plateau (plus large)
    const plateGeometry = new THREE.BoxGeometry(12, 0.35, 6);
    const plateMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const plate = new THREE.Mesh(plateGeometry, plateMaterial);
    plate.position.set(0, 0, 0);
    scene.add(plate);

    let player1Score = 0;
    let player2Score = 0;

    // Fonction pour mettre à jour le score dans l'HTML
    function updateScore()
    {
        const scoreBoard = document.getElementById('scoreBoard');
        scoreBoard.innerHTML = `Player 1 ${player1Score} : ${player2Score} Player 2 `;
    }

    function resetScore()
    {
        player1Score = 0;
        player2Score = 0;
        updateScore();
    }

    // Bordures horizontales (haut/bas) en rouge
    const bordHGeometry = new THREE.BoxGeometry(12, 0.5, 0.5);
    const bordHMaterial = new THREE.MeshStandardMaterial({ color: 0x434788 });

    const bordHaut = new THREE.Mesh(bordHGeometry, bordHMaterial);
    bordHaut.position.set(0, 0.5, 3.25);
    scene.add(bordHaut);

    const bordBas = new THREE.Mesh(bordHGeometry, bordHMaterial);
    bordBas.position.set(0, 0.5, -3.25);
    scene.add(bordBas);

    // Lumières
    const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(5, 10, 5).normalize();
    scene.add(directionalLight);

    // Création de la géométrie de la balle (sphère)
    const geometry = new THREE.SphereGeometry(0.25, 16, 16);
    const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
    const ball = new THREE.Mesh(geometry, material);
    ball.position.set(0, 0.5, 0);
    scene.add(ball);

    // Initialisation des vitesses (physique simple)
    let ballVelocity = new THREE.Vector3(0.05, 0, 0.05); // Vitesse initiale de la balle
    const ballSpeed = 0.1; // Contrôle de la vitesse de la balle

    // Création des paddles
    const paddleLG = new THREE.BoxGeometry(0.1, 0.5, 1.5);
    const paddleLM = new THREE.MeshStandardMaterial({ color: 0x6478ff });
    const paddleLeft = new THREE.Mesh(paddleLG, paddleLM);
    paddleLeft.position.set(-5.5, 0.5, 0);
    scene.add(paddleLeft);

    const paddleRG = new THREE.BoxGeometry(0.1, 0.5, 1.5);
    const paddleRM = new THREE.MeshStandardMaterial({ color: 0x6478ff });
    const paddleRight = new THREE.Mesh(paddleRG, paddleRM);
    paddleRight.position.set(5.5, 0.5, 0);
    scene.add(paddleRight);

    // Variables pour la gestion du mouvement des paddles
    let paddleLeftSpeed = 0;
    let paddleRightSpeed = 0;
    const paddleMaxSpeed = 0.1;

    // Contrôles du clavier
    window.addEventListener('keydown', (event) => {
        if (event.key === 'w') paddleLeftSpeed = -paddleMaxSpeed;
        if (event.key === 's') paddleLeftSpeed = paddleMaxSpeed;
        if (event.key === 'ArrowUp') paddleRightSpeed = -paddleMaxSpeed;
        if (event.key === 'ArrowDown') paddleRightSpeed = paddleMaxSpeed;
    });

    window.addEventListener('keyup', (event) => {
        if (event.key === 'w' || event.key === 's') paddleLeftSpeed = 0;
        if (event.key === 'ArrowUp' || event.key === 'ArrowDown') paddleRightSpeed = 0;
    });
    
    // Condition Victoire
    function checkWin()
    {
        console.log(isTournament);
        if (isTournament == false)
        {
            if (player1Score === 3)
            {
                gameOver = true; // Empêche que cela se répète
                document.getElementById('choix-jeu').style.display = 'block'; // Affiche la section
                document.getElementById('choix-PONG').style.display = 'none'; // Cache le jeu
                resetScore();
                return true; // Stopper l'animation
            }
            if (player2Score === 3)
            {
                gameOver = true; // Empêche que cela se répète
                document.getElementById('choix-jeu').style.display = 'block'; // Affiche la section
                document.getElementById('choix-PONG').style.display = 'none'; // Cache le jeu
                resetScore();
                return true; // Stopper l'animation
            }
        }
        else
        {
            if (player1Score === 3) {
                gameOver = true;
                document.getElementById('match-display').style.display = 'block';
                document.getElementById('choix-PONG').style.display = 'none';
                resetScore();
                finishMatch(currentMatchIndex, "Player 1"); // Met à jour le gagnant
                return true;
            }
            if (player2Score === 3) {
                gameOver = true;
                document.getElementById('match-display').style.display = 'block';
                document.getElementById('choix-PONG').style.display = 'none';
                resetScore();
                finishMatch(currentMatchIndex, "Player 2"); // Met à jour le gagnant
                return true;
            }
        }
        return false;
    }


    function animate() {
        if (!gameOver) {
            requestAnimationFrame(animate);
        }
    
        if (checkWin()) {
            ia = false;
            return;
        }
    
        // Déplacer la balle
        ball.position.add(ballVelocity);
    
        // Vérification des collisions avec les bordures verticales
        if (ball.position.z > 2.8 || ball.position.z < -2.8) {
            ballVelocity.z = -ballVelocity.z;
        }
    
        // Vérification des collisions avec les paddles
        if (ball.position.z > paddleLeft.position.z - 0.75 && ball.position.z < paddleLeft.position.z + 0.75 &&
            ball.position.x > paddleLeft.position.x - 0.2 && ball.position.x < paddleLeft.position.x + 0.1) {
            ballVelocity.x = -ballVelocity.x * 1.2;
        }
    
        if (ball.position.z > paddleRight.position.z - 0.75 && ball.position.z < paddleRight.position.z + 0.75 &&
            ball.position.x > paddleRight.position.x - 0.2 && ball.position.x < paddleRight.position.x + 0.2) {
            ballVelocity.x = -ballVelocity.x * 1.2;
        }
    
        // Vérification des collisions avec les bords gauche/droit
        if (ball.position.x > 6.25) {
            player1Score++;
            updateScore();
            resetGame();
        }
    
        if (ball.position.x < -6.25) {
            player2Score++;
            updateScore();
            resetGame();
        }
    
        // Déplacer les paddles
        paddleLeft.position.z += paddleLeftSpeed;
        
        if (ia)
        {
            let currentTime = Date.now();
            if (currentTime - lastIaUpdate > 1000) { // Vérifie si 1 seconde est écoulée
                lastIaUpdate = currentTime; // Met à jour le dernier moment où l'IA a réagi


                if (Math.random() < 0.99) { // 20% de chance que l'IA soit quasiment imbattable
                    // Anticipation parfaite et déplacement du paddle avec une grande vitesse
                    let perfectFutureBallZ = ball.position.z + ballVelocity.z * 100; // Anticipation parfaite
                    perfectFutureBallZ = Math.max(-2.2, Math.min(2.2, perfectFutureBallZ));
                
                    // Déplacement ultra-rapide du paddle vers la position future du ballon
                    if (perfectFutureBallZ > paddleRight.position.z) {
                        paddleRight.position.z += paddleMaxSpeed * 10; // 5x plus rapide
                    } else if (perfectFutureBallZ < paddleRight.position.z) {
                        paddleRight.position.z -= paddleMaxSpeed * 10; // 5x plus rapide
                    }
                }
                else

                {
                    // Simulation d'erreur plus réaliste (mauvaise anticipation)
                    paddleRight.position.z += (Math.random() > 0.5 ? paddleMaxSpeed * speedFactor : -paddleMaxSpeed * speedFactor);
                }
            }
        }
        else
        {
            paddleRight.position.z += paddleRightSpeed;
        }

    
        // Limiter les mouvements des paddles
        limitPaddleMovement();
    
        renderer.render(scene, camera);
    }
    
    function limitPaddleMovement() {
        paddleLeft.position.z = Math.max(-2.2, Math.min(2.2, paddleLeft.position.z));
        paddleRight.position.z = Math.max(-2.2, Math.min(2.2, paddleRight.position.z));
    }
    
    function resetGame() {
        ball.position.set(0, 0.5, 0);
        ballVelocity.set(0.05, 0, 0.05);
        paddleLeft.position.set(-5.5, 0.5, 0);
        paddleRight.position.set(5.5, 0.5, 0);
    }
    
    animate();    
}

document.getElementById('button-commencer').addEventListener('click', () => {
    // Affichez la section du jeu
    const pongSection = document.getElementById('choix-PONG');
    pongSection.style.display = 'block';
  
    // Supprimer uniquement le canvas existant, s'il existe
    const existingCanvas = pongSection.querySelector('canvas');
    if (existingCanvas) {
      pongSection.removeChild(existingCanvas);
    }
  
    // Démarrer le jeu en créant un nouveau canvas
    initPongGame();
  });
  
// Lorsque le bouton "Commencer" pour l'IA est pressé
document.getElementById('button-startIa').addEventListener('click', () => {
    // Afficher la section du jeu
    const pongSection = document.getElementById('choix-PONG');
    pongSection.style.display = 'block';
  
    // Supprimer le canvas existant, s'il existe
    const existingCanvas = pongSection.querySelector('canvas');
    if (existingCanvas) {
        pongSection.removeChild(existingCanvas);
    }
  
    // Démarrer le jeu en créant un nouveau canvas
    ia = true;  // Active l'IA pour le paddle droit
    initPongGame();
});
