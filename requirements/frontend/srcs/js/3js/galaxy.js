import * as THREE from 'https://unpkg.com/three@0.153.0/build/three.module.js';

export default function setupGalaxyView() {
  // Conteneur pour le rendu
  const app = document.getElementById("app");
  app.innerHTML = `<div id="overlay">
                    <h1 id="overlay-text">Transcendence</h1>
                    <a href="/#dashboard" class="cancel-btn">Démarrer</a>
                  </div>`;

  // Configuration de la scène
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  app.appendChild(renderer.domElement);

  // Lumières néon bleues
  const neonLight1 = new THREE.PointLight(0x00aaff, 1.5, 50);
  neonLight1.position.set(5, 5, 5);
  const neonLight2 = new THREE.PointLight(0x0055ff, 1.5, 50);
  neonLight2.position.set(-5, -5, 5);
  scene.add(neonLight1, neonLight2);

  // Boule centrale (style néon bleu)
  const ballGeometry = new THREE.SphereGeometry(1, 32, 32);
  const ballMaterial = new THREE.MeshStandardMaterial({
    color: 0x0000ff,
    emissive: 0x0077ff,
    emissiveIntensity: 1.5,
    metalness: 0.8,
    roughness: 0.2,
  });
  const ball = new THREE.Mesh(ballGeometry, ballMaterial);
  scene.add(ball);

  // Particules lumineuses (arrière-plan)
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 500;
  const positions = new Float32Array(particlesCount * 3);
  for (let i = 0; i < particlesCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 20;
  }
  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particlesMaterial = new THREE.PointsMaterial({
    color: 0x00ffff,
    size: 0.1,
  });
  const particles = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particles);

  // Arrière-plan brumeux
  const fogTexture = new THREE.TextureLoader().load('https://threejsfundamentals.org/threejs/resources/images/star.png');
  const fogMaterial = new THREE.SpriteMaterial({ map: fogTexture, transparent: true, opacity: 0.05 });
  const fogSprites = [];
  for (let i = 0; i < 10; i++) {
    const fog = new THREE.Sprite(fogMaterial);
    fog.position.set(
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
      (Math.random() - 0.5) * 20,
    );
    fog.scale.set(5, 5, 5);
    scene.add(fog);
    fogSprites.push(fog);
  }

  // Position de la caméra
  camera.position.z = 10;

  // Variables pour l'animation de la lévitation
  let levitationDirection = 1;
  const levitationSpeed = 0.005;
  const levitationAmplitude = 0.5;

  // Animation
  function animate() {
    requestAnimationFrame(animate);

    // Boule en rotation
    ball.rotation.y += 0.01;

    // Animation de lévitation
    ball.position.y += levitationSpeed * levitationDirection;
    if (ball.position.y > levitationAmplitude || ball.position.y < -levitationAmplitude) {
      levitationDirection *= -1; // Inverser la direction
    }

    // Particules et brouillard en mouvement
    particles.rotation.y += 0.002;
    fogSprites.forEach((fog) => {
      fog.position.z += 0.01;
      if (fog.position.z > 10) fog.position.z = -10;
    });

    renderer.render(scene, camera);
  }
  animate();

  // Réagir au redimensionnement
  function onResize() {
    const aspectRatio = window.innerWidth / window.innerHeight;

    // Ajuster la caméra
    camera.aspect = aspectRatio;
    camera.updateProjectionMatrix();

    // Ajuster la taille du rendu
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Ajouter une limite pour les très petits écrans
    if (window.innerWidth < 768) {
      camera.fov = 90;
    } else {
      camera.fov = 75;
    }
    camera.updateProjectionMatrix();
  }

  window.addEventListener('resize', onResize);
  onResize();
}

