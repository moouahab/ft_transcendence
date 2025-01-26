import * as THREE from 'https://unpkg.com/three@0.153.0/build/three.module.js';

    // Configuration de la scène
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Lumières néon
    const neonLight1 = new THREE.PointLight(0xff007f, 1, 50);
    neonLight1.position.set(5, 5, 5);
    const neonLight2 = new THREE.PointLight(0x8f00ff, 1, 50);
    neonLight2.position.set(-5, -5, 5);
    scene.add(neonLight1, neonLight2);

    // Boule centrale (style néon)
    const ballGeometry = new THREE.SphereGeometry(1, 32, 32);
    const ballMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: 0xff007f,
      emissiveIntensity: 1,
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
      color: 0x8f00ff,
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

    // Animation
    function animate() {
      requestAnimationFrame(animate);

      // Boule en rotation
      ball.rotation.y += 0.01;

      // Particules et brouillard en mouvement
      particles.rotation.y += 0.002;
      fogSprites.forEach((fog) => {
        fog.position.z += 0.01;
        if (fog.position.z > 10) fog.position.z = -10;
      });

      renderer.render(scene, camera);
    }
    animate();

    // Démarrer le jeu
    function startGame() {
      alert('Le jeu commence ici!');
      // Redirection ou logique du jeu
    }

    // Réagir au redimensionnement
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });