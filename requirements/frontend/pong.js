let ia = false;
let lastIaUpdate = Date.now();
let speedFactor = 5;
var isTournament = false;
const player1Name = localStorage.getItem('username');

function initPongGame() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(95, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });

    // Utilisation de la section #choix-PONG pour le rendu
    renderer.setSize(window.innerWidth / 1.5, window.innerHeight / 1.5);
    
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
    camera.position.set(0, 6, 10);
    // camera.position.set(0, 10, 10);
    camera.lookAt(0, 0, 0);

    //MICK START
    // Position initiale de la caméra (avant que le jeu démarre)
    camera.position.set(0, 0, 10);
    camera.lookAt(0, 0, 0);

    // Position finale désirée pour la caméra
    // const targetPosition = new THREE.Vector3(0, 8, 8);
    const targetPosition = new THREE.Vector3(0, 8, 0);

    let startTime = null;

    function animateCamera(timestamp) {
        if (!startTime) startTime = timestamp; // Temps de départ

        const elapsedTime = timestamp - startTime; // Temps depuis le lancement de l'animation
        const duration = 1000; // temps total pour le mouvement (ms)

        if (elapsedTime < duration) {
            const progress = elapsedTime / duration;

            // Interpolating between the initial position and the target position
            camera.position.lerpVectors(new THREE.Vector3(0, 6, 10), targetPosition, progress);

            // Optionally, you can also interpolate the camera's lookAt position
            camera.lookAt(0, 0, 0);
        } else {
            // Once the animation is complete, ensure the camera is in the final position
            camera.position.copy(targetPosition);
            camera.lookAt(0, 0, 0); // Ensure it's still looking at the center
        }

        renderer.render(scene, camera); // Render the scene
        requestAnimationFrame(animateCamera); // Loop the animation
    }

    // Demarrer l'anumation de la camera
    requestAnimationFrame(animateCamera);

    //MICK END

    // Plateau (plus large)
    const plateGeometry = new THREE.BoxGeometry(14, 0.1, 10);
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
        scoreBoard.innerHTML = `${translations[currentLang]["player1"]} ${player1Score} : ${player2Score} ${translations[currentLang]["player2"]}`;
    }

    function resetScore()
    {
        player1Score = 0;
        player2Score = 0;
        updateScore();
    }

    // Bordures horizontales (haut/bas) en rouge MICK
    // Bordures horizontales (haut/bas) en gris
    const bordHGeometry = new THREE.BoxGeometry(14, 0.5, 0.5);
    const bordHMaterial = new THREE.MeshStandardMaterial({ color: 0x434788 });

    const bordHaut = new THREE.Mesh(bordHGeometry, bordHMaterial);
    bordHaut.position.set(0, 0.5, 5);
    scene.add(bordHaut);

    const bordBas = new THREE.Mesh(bordHGeometry, bordHMaterial);
    bordBas.position.set(0, 0.5, -5);
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
    const ballSpeed = 0.05; // Contrôle de la vitesse de la balle
    // let ballVelocity = new THREE.Vector3(0.05, 0, 0.05); // Vitesse initiale de la balle
    let ballVelocity = generateRandomVelocity(0.5, 1, 0.2, 1, ballSpeed);

    // Création des paddles
    const paddleLG = new THREE.BoxGeometry(0.1, 0.5, 1.5);
    const paddleLM = new THREE.MeshStandardMaterial({ color: 0x6478ff });
    const paddleLeft = new THREE.Mesh(paddleLG, paddleLM);
    paddleLeft.position.set(-6.5, 0.5, 0);
    scene.add(paddleLeft);

    const paddleRG = new THREE.BoxGeometry(0.1, 0.5, 1.5);
    const paddleRM = new THREE.MeshStandardMaterial({ color: 0x6478ff });
    const paddleRight = new THREE.Mesh(paddleRG, paddleRM);
    paddleRight.position.set(6.5, 0.5, 0);
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
        if (isTournament == false)
        {
            if (player1Score === 3)
            {
                gameOver = true; // Empêche que cela se répète
                document.getElementById('choix-PONG').style.display = 'none'; // Cache le jeu
                showSection('choix-jeu');
                resetScore();
                updateMatchHistory("win");
                return true; // Stopper l'animation
            }
            if (player2Score === 3)
            {
                gameOver = true; // Empêche que cela se répète
                document.getElementById('choix-PONG').style.display = 'none'; // Cache le jeu
                showSection('choix-jeu');
                resetScore();
                updateMatchHistory("loss");
                return true; // Stopper l'animation
            }
        }
        else
        {
            if (player1Score === 3) {
                gameOver = true;
                document.getElementById('choix-PONG').style.display = 'none';
                showSection('match-display');
                resetScore();
                finishMatch(currentMatchIndex, "Player 1");
                return true;
            }
            if (player2Score === 3) {
                gameOver = true;
                document.getElementById('choix-PONG').style.display = 'none';
                showSection('match-display');
                resetScore();
                finishMatch(currentMatchIndex, "Player 2");
                return true;
            }
        }
        return false;
    }

    function updateAI()
    {
        let currentTime = Date.now();
        let ballX = ball.position.x;
        let ballZ = ball.position.z;
        let speedX = ballVelocity.x;
        let speedZ = ballVelocity.z;
        let targetX = 6.5;
        let predictedZAtX = null;
        let breakPoint = null;

        let positionBall = paddleRight.position.z;
        let timeToReachX = (targetX - ballX) / speedX;
        
        if (timeToReachX > 0 && speedX !== 0)
        {
            predictedZAtX = ballZ + speedZ * timeToReachX;
            // drawRedPoint(targetX, predictedZAtX); // DEBUG pour l ia
            if (predictedZAtX < 4.5 && predictedZAtX > -4.5)
            {
                breakPoint = predictedZAtX;
                console.log(breakPoint);
            }
        }

        if (currentTime - lastIaUpdate >= 1000)
        {
            lastIaUpdate = currentTime;
            if (breakPoint !== null)
                positionBall = breakPoint;
        }

        let zone2 = 4.5 / 2;

        if (breakPoint !== null) {
            if (breakPoint > zone2) {
                positionBall = 2.25;
            } else if (breakPoint < -zone2) {
                positionBall = -2.25;
            }
        }

        if (breakPoint > paddleRight.position.z)
            paddleRight.position.z += paddleMaxSpeed;
        else if (breakPoint < paddleRight.position.z)
            paddleRight.position.z -= paddleMaxSpeed;
    }

    // // DEBUG IA
    // function drawRedPoint(x, z)
    // {
    //     let geometry = new THREE.SphereGeometry(0.1, 32, 32);
    //     let material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    //     let point = new THREE.Mesh(geometry, material);
    //     point.position.set(x, 0, z);
    //     scene.add(point);
    // }
    

    function animate() {
        if (!gameOver) {
            requestAnimationFrame(animate);
        }
    
        if (checkWin()) {
            ia = false;
            return;
        }
    
        ball.position.add(ballVelocity);
    
        if (ball.position.z > 4.5 || ball.position.z < -4.5) {
            ballVelocity.z = -ballVelocity.z;
        }
    
        const paddleWidth = 0.2; // Largeur de la raquette
        const paddleHeight = 0.75; // Hauteur de la raquette (dans l'axe Z)

        // Collision avec la raquette gauche (paddleLeft)
        if (ball.position.z > paddleLeft.position.z - paddleHeight && ball.position.z < paddleLeft.position.z + paddleHeight &&
            ball.position.x > paddleLeft.position.x - paddleWidth && ball.position.x < paddleLeft.position.x + paddleWidth) {
            let reboundFactor = 1.1;
            updateBallVelocityOnPaddleHit(
                ball,
                ballVelocity,
                paddleLeft,
                reboundFactor * Math.sqrt(ballVelocity.x * ballVelocity.x + ballVelocity.z * ballVelocity.z),
                paddleHeight);
            // ballVelocity.z += paddleLeftSpeed * 0.1;
        }

        // Collision avec la raquette droite (paddleRight)
        if (ball.position.z > paddleRight.position.z - paddleHeight && ball.position.z < paddleRight.position.z + paddleHeight &&
            ball.position.x > paddleRight.position.x - paddleWidth && ball.position.x < paddleRight.position.x + paddleWidth) {
            let reboundFactor = 1.1;
            ballVelocity.x = -ballVelocity.x * reboundFactor;
            ballVelocity.z += paddleRightSpeed * 0.1;
        }
        
        if (ball.position.x > 6.5) {
            player1Score++;
            updateScore();
            resetGame();
        }
    
        if (ball.position.x < -6.5) {
            player2Score++;
            updateScore();
            resetGame();
        }

        paddleLeft.position.z += paddleLeftSpeed;

        if (ia)
        {
            updateAI();
        }
        else
            paddleRight.position.z += paddleRightSpeed;

        limitPaddleMovement();
        renderer.render(scene, camera);
    }
    
    function limitPaddleMovement() {
        paddleLeft.position.z = Math.max(-4, Math.min(4, paddleLeft.position.z));
        paddleRight.position.z = Math.max(-4, Math.min(4, paddleRight.position.z));
    }

    function generateRandomVelocity(minX, maxX, minZ, maxZ, curSpeed) {
        // Générer la composante X entre -maxX, -minX ou +minX, +maxX
        let xDirection = (Math.random() * (maxX - minX) + minX);
        xDirection *= (Math.random() > 0.5 ? 1 : -1);

        // Générer la composante Z entre minZ et maxZ
        let zDirection = (Math.random() * (maxZ - minZ) + minZ);
        zDirection *= (Math.random() > 0.5 ? 1 : -1);

        // Créer le vecteur de direction
        let randomDirection = new THREE.Vector3(xDirection, 0, zDirection);
      
        // Normaliser le vecteur pour une magnitude de 1
        randomDirection.normalize();
      
        // Multiplier par la vitesse souhaitée (curSpeed)
        let ballVelocity = randomDirection.multiplyScalar(curSpeed);
      
        return ballVelocity;
    }
    
    // Fonction pour calculer la nouvelle vitesse de la balle en fonction du point de contact avec la palette
    function updateBallVelocityOnPaddleHit(ball, ballVelocity, paddle, speed, paddleHeight) {
        // Calculer la position relative du point de contact sur la palette
        let hitPosition = ball.position.z - paddle.position.z;  // Supposons que la palette se déplace le long de l'axe z

        // Normaliser la position du point de contact : -0.5 signifie un contact en bas de la palette,
        // 0 signifie au centre, +0.5 signifie en haut de la palette
        let normalizedHitPosition = hitPosition / paddleHeight;
        console.log(normalizedHitPosition);

        // Appliquer un facteur pour contrôler l'angle de rebond en fonction du point de contact
        let angleFactor = 1; // Contrôle de l'angle du rebond selon la position du contact
        let angle = normalizedHitPosition * angleFactor;

        // Calculer les nouvelles composantes de la vitesse en fonction de l'angle
        // let randomX = Math.random() > 0.5 ? 1 : -1;  // Direction aléatoire sur l'axe x
        // let randomZ = Math.sign(ballVelocity.z);  // Garder la direction z, à moins que le contact avec la palette ne la change

        // Ajuster la vitesse en fonction du point de contact sur la palette
        //ballVelocity.x = randomX * speed;  // La vitesse en x est aléatoire, donnée par la direction du joueur
        ballVelocity.x = -Math.sign(ballVelocity.x) * speed * Math.cos(angle * Math.PI);  // La vitesse en z dépend du point de contact avec la palette
        ballVelocity.z = speed * Math.sin(angle * Math.PI);  // La vitesse en z dépend du point de contact avec la palette
        console.log('speed ', speed);
        console.log('speed ', Math.sqrt(ballVelocity.x * ballVelocity.x + ballVelocity.z * ballVelocity.z));
        console.log('ballVelocity.x ', ballVelocity.x);
        console.log('ballVelocity.z ', ballVelocity.z);

        // Optionnellement, limiter l'angle du rebond pour éviter des rebonds trop extrêmes
        if (Math.abs(ballVelocity.z) > speed) {
            ballVelocity.z = Math.sign(ballVelocity.z) * speed;
        }
    }

    function resetGame() {
        ball.position.set(0, 0.5, 0);
        
        // let speed = 0.07;
        // let randomX = (Math.random() > 0.5 ? 1 : -1) * speed;
        // let randomZ = (Math.random() > 0.5 ? 1 : -1) * speed;
        // ballVelocity.set(randomX, 0, randomZ);
        ballVelocity = generateRandomVelocity(0.5, 1, 0.2, 1, ballSpeed);
        // ballVelocity.set(0.05, 0, 0.05);
        paddleLeft.position.set(-6.5, 0.5, 0);
        paddleRight.position.set(6.5, 0.5, 0);
    }
    
    animate();    
}

document.getElementById('button-commencer').addEventListener('click', () => {
    const pongSection = document.getElementById('choix-PONG');
    pongSection.style.display = 'block';
  
    const existingCanvas = pongSection.querySelector('canvas');
    if (existingCanvas)
      pongSection.removeChild(existingCanvas);
  
    initPongGame();
});
  
document.getElementById('button-startIa').addEventListener('click', () => {
    const pongSection = document.getElementById('choix-PONG');
    pongSection.style.display = 'block';
  
    const existingCanvas = pongSection.querySelector('canvas');
    if (existingCanvas)
        pongSection.removeChild(existingCanvas);
  
    ia = true;
    initPongGame();
});