/* ─── Three.js 3D Scenes ─── */

(function() {
  'use strict';

  /* ============================================================
     HERO CANVAS — Floating 3D Particles + Mouse Parallax
  ============================================================ */
  const heroCanvas = document.getElementById('hero-canvas');
  if (!heroCanvas || typeof THREE === 'undefined') return;

  // Scene setup
  const heroRenderer = new THREE.WebGLRenderer({ canvas: heroCanvas, alpha: true, antialias: true });
  heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  heroRenderer.setSize(window.innerWidth, window.innerHeight);

  const heroScene = new THREE.Scene();
  const heroCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
  heroCamera.position.z = 5;

  /* --- Particle Field --- */
  const particleCount = 1800;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const colorPalette = [
    new THREE.Color('#6C3BFF'),
    new THREE.Color('#9B6FFF'),
    new THREE.Color('#C084FC'),
    new THREE.Color('#EC4899'),
    new THREE.Color('#4A1FCC'),
  ];

  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    positions[i3]     = (Math.random() - 0.5) * 24;
    positions[i3 + 1] = (Math.random() - 0.5) * 18;
    positions[i3 + 2] = (Math.random() - 0.5) * 10;

    const c = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    colors[i3]     = c.r;
    colors[i3 + 1] = c.g;
    colors[i3 + 2] = c.b;
  }

  const particleGeo = new THREE.BufferGeometry();
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.055,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true,
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  heroScene.add(particles);

  /* --- Floating Geometric Shapes --- */
  const shapes = [];

  function makeGlowMesh(geo, hue) {
    const mat = new THREE.MeshStandardMaterial({
      color: new THREE.Color().setHSL(hue, 0.9, 0.55),
      emissive: new THREE.Color().setHSL(hue, 0.9, 0.25),
      emissiveIntensity: 0.8,
      wireframe: false,
      transparent: true,
      opacity: 0.65,
      roughness: 0.2,
      metalness: 0.6,
    });
    return new THREE.Mesh(geo, mat);
  }

  // Octahedron
  const oct = makeGlowMesh(new THREE.OctahedronGeometry(0.5, 0), 0.72);
  oct.position.set(4, 1.5, -1);
  heroScene.add(oct);
  shapes.push({ mesh: oct, rx: 0.012, ry: 0.008, floatAmp: 0.3, floatSpeed: 0.8 });

  // Torus
  const tor = makeGlowMesh(new THREE.TorusGeometry(0.45, 0.14, 16, 60), 0.78);
  tor.position.set(-4.5, -1, -2);
  heroScene.add(tor);
  shapes.push({ mesh: tor, rx: 0.008, ry: 0.015, floatAmp: 0.25, floatSpeed: 1 });

  // Icosahedron
  const ico = makeGlowMesh(new THREE.IcosahedronGeometry(0.38, 0), 0.82);
  ico.position.set(3, -2, -0.5);
  heroScene.add(ico);
  shapes.push({ mesh: ico, rx: 0.01, ry: 0.012, floatAmp: 0.2, floatSpeed: 1.2 });

  // Small cube (wireframe)
  const cubeWire = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.6, 0.6),
    new THREE.MeshBasicMaterial({ color: 0x6C3BFF, wireframe: true, transparent: true, opacity: 0.4 })
  );
  cubeWire.position.set(-3, 2, -1.5);
  heroScene.add(cubeWire);
  shapes.push({ mesh: cubeWire, rx: 0.009, ry: 0.011, floatAmp: 0.18, floatSpeed: 0.9 });

  // Dodecahedron
  const dodec = makeGlowMesh(new THREE.DodecahedronGeometry(0.3, 0), 0.74);
  dodec.position.set(-1.5, 2.5, -2);
  heroScene.add(dodec);
  shapes.push({ mesh: dodec, rx: 0.007, ry: 0.013, floatAmp: 0.22, floatSpeed: 1.1 });

  /* --- Lighting --- */
  heroScene.add(new THREE.AmbientLight(0xffffff, 0.3));
  const pLight1 = new THREE.PointLight(0x6C3BFF, 3, 12);
  pLight1.position.set(2, 3, 3);
  heroScene.add(pLight1);
  const pLight2 = new THREE.PointLight(0xEC4899, 2, 12);
  pLight2.position.set(-3, -2, 2);
  heroScene.add(pLight2);

  /* --- Mouse parallax --- */
  let mouseX = 0, mouseY = 0;
  let targetMouseX = 0, targetMouseY = 0;

  document.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  /* --- Resize --- */
  window.addEventListener('resize', () => {
    heroCamera.aspect = window.innerWidth / window.innerHeight;
    heroCamera.updateProjectionMatrix();
    heroRenderer.setSize(window.innerWidth, window.innerHeight);
  });

  /* --- Hero Animation Loop --- */
  const heroStartTime = Date.now();

  function animateHero() {
    requestAnimationFrame(animateHero);
    const elapsed = (Date.now() - heroStartTime) * 0.001;

    // Smooth mouse follow
    mouseX += (targetMouseX - mouseX) * 0.04;
    mouseY += (targetMouseY - mouseY) * 0.04;

    // Rotate particle cloud slightly with mouse
    particles.rotation.x = mouseY * 0.08;
    particles.rotation.y = mouseX * 0.08 + elapsed * 0.04;

    // Animate shapes individually
    shapes.forEach((s, i) => {
      s.mesh.rotation.x += s.rx;
      s.mesh.rotation.y += s.ry;
      // Floating up-down
      const baseY = s.mesh.position.y;
      s.mesh.position.y = s.mesh.userData.baseY === undefined
        ? (s.mesh.userData.baseY = s.mesh.position.y)
        : s.mesh.userData.baseY + Math.sin(elapsed * s.floatSpeed + i * 1.2) * s.floatAmp;

      // Mouse parallax tilt
      s.mesh.rotation.x += mouseY * 0.002;
      s.mesh.rotation.y += mouseX * 0.002;
    });

    // Subtle camera drift
    heroCamera.position.x = mouseX * 0.3;
    heroCamera.position.y = -mouseY * 0.2;
    heroCamera.lookAt(heroScene.position);

    heroRenderer.render(heroScene, heroCamera);
  }

  animateHero();


  /* ============================================================
     SKILLS CANVAS — Floating Ring of Icons
  ============================================================ */
  const skillsCanvas = document.getElementById('skills-canvas');
  if (!skillsCanvas) return;

  const sRenderer = new THREE.WebGLRenderer({ canvas: skillsCanvas, alpha: true, antialias: true });
  sRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const sContainer = skillsCanvas.parentElement;
  const sw = sContainer.offsetWidth, sh = sContainer.offsetHeight;
  sRenderer.setSize(sw, sh);

  const sScene = new THREE.Scene();
  const sCamera = new THREE.PerspectiveCamera(60, sw / sh, 0.1, 50);
  sCamera.position.z = 5;

  sScene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const sl = new THREE.PointLight(0x9B6FFF, 3, 12);
  sl.position.set(0, 2, 3);
  sScene.add(sl);

  // Ring of small floating spheres
  const ringItems = [];
  const count = 10;
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const radius = 3.2;
    const hue = 0.70 + (i / count) * 0.15;
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 16, 16),
      new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(hue, 0.9, 0.6),
        emissive: new THREE.Color().setHSL(hue, 0.9, 0.3),
        emissiveIntensity: 0.9,
        roughness: 0.1,
        metalness: 0.5,
      })
    );
    mesh.position.set(Math.cos(angle) * radius, Math.sin(angle) * 0.8, Math.sin(angle) * radius * 0.5);
    sScene.add(mesh);
    ringItems.push(mesh);
  }

  // Central torus-knot
  const centerKnot = new THREE.Mesh(
    new THREE.TorusKnotGeometry(0.7, 0.22, 80, 12),
    new THREE.MeshStandardMaterial({
      color: 0x6C3BFF,
      emissive: 0x3A1FBB,
      emissiveIntensity: 0.6,
      roughness: 0.15,
      metalness: 0.8,
    })
  );
  sScene.add(centerKnot);

  window.addEventListener('resize', () => {
    const nw = sContainer.offsetWidth, nh = sContainer.offsetHeight;
    sCamera.aspect = nw / nh;
    sCamera.updateProjectionMatrix();
    sRenderer.setSize(nw, nh);
  });

  const sStart = Date.now();
  function animateSkills() {
    requestAnimationFrame(animateSkills);
    const t = (Date.now() - sStart) * 0.001;

    centerKnot.rotation.x = t * 0.3;
    centerKnot.rotation.y = t * 0.5;

    ringItems.forEach((m, i) => {
      const angle = (i / count) * Math.PI * 2 + t * 0.35;
      m.position.x = Math.cos(angle) * 3.2;
      m.position.y = Math.sin(t * 0.7 + i) * 0.4;
      m.position.z = Math.sin(angle) * 1.8;
      m.rotation.y = t + i;
    });

    sRenderer.render(sScene, sCamera);
  }
  animateSkills();

})();
