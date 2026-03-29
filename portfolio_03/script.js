/* ===================================================
   MOHD SAMI – Portfolio Script (Enhanced 3D Edition)
   =================================================== */

'use strict';

/* ============================
   CUSTOM CURSOR
   ============================ */
const cursor         = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursor-follower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

(function animateFollower() {
  followerX += (mouseX - followerX) * 0.12;
  followerY += (mouseY - followerY) * 0.12;
  cursorFollower.style.left = followerX + 'px';
  cursorFollower.style.top  = followerY + 'px';
  requestAnimationFrame(animateFollower);
})();

document.addEventListener('mouseleave', () => { cursor.style.opacity = '0'; cursorFollower.style.opacity = '0'; });
document.addEventListener('mouseenter', () => { cursor.style.opacity = '1'; cursorFollower.style.opacity = '1'; });

/* ============================
   NAVBAR
   ============================ */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('active');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
  });
});

/* =====================================================
   THREE.JS – HERO: DATA GLOBE + PARTICLES + SHAPES
   ===================================================== */
(function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!window.THREE || !canvas) return;

  const scene  = new THREE.Scene();
  const W = window.innerWidth, H = window.innerHeight;
  const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 1000);
  camera.position.set(0, 0, 55);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(W, H);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  /* ── Central Data Globe ── */
  const globeGroup = new THREE.Group();
  scene.add(globeGroup);

  // Outer wireframe sphere
  const globeGeo = new THREE.SphereGeometry(18, 36, 36);
  const globeMat = new THREE.MeshBasicMaterial({
    color: 0x722F37, wireframe: true, transparent: true, opacity: 0.18
  });
  globeGroup.add(new THREE.Mesh(globeGeo, globeMat));

  // Inner solid core
  const coreGeo = new THREE.SphereGeometry(12, 32, 32);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0x1a0810, transparent: true, opacity: 0.85
  });
  globeGroup.add(new THREE.Mesh(coreGeo, coreMat));

  // Mid wireframe layer (counter-rotating)
  const midGeo = new THREE.IcosahedronGeometry(14, 2);
  const midMat = new THREE.MeshBasicMaterial({
    color: 0x9b3f4a, wireframe: true, transparent: true, opacity: 0.12
  });
  const midMesh = new THREE.Mesh(midGeo, midMat);
  globeGroup.add(midMesh);

  // Orbit rings
  function makeRing(radius, tilt, color) {
    const pts = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.5 });
    const ring = new THREE.LineLoop(geo, mat);
    ring.rotation.x = tilt;
    globeGroup.add(ring);
    return ring;
  }
  const ring1 = makeRing(20, Math.PI * 0.2,  0x722F37);
  const ring2 = makeRing(22, Math.PI * 0.5,  0x9b3f4a);
  const ring3 = makeRing(24, Math.PI * 0.75, 0x4e1f25);

  // Surface data-node points on the globe
  const nodeCount = 200;
  const nodePos   = new Float32Array(nodeCount * 3);
  for (let i = 0; i < nodeCount; i++) {
    const phi   = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;
    const r     = 18.2;
    nodePos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
    nodePos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
    nodePos[i*3+2] = r * Math.cos(phi);
  }
  const nodeGeo = new THREE.BufferGeometry();
  nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePos, 3));
  const nodeMat = new THREE.PointsMaterial({ color: 0xcc4455, size: 0.55, transparent: true, opacity: 0.9 });
  globeGroup.add(new THREE.Points(nodeGeo, nodeMat));

  /* ── Background space particles ── */
  const pCount = 500;
  const pPos   = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    pPos[i*3]   = (Math.random() - 0.5) * 350;
    pPos[i*3+1] = (Math.random() - 0.5) * 300;
    pPos[i*3+2] = (Math.random() - 0.5) * 200 - 60;
  }
  const bgGeo = new THREE.BufferGeometry();
  bgGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const bgMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.35, transparent: true, opacity: 0.35 });
  const bgParticles = new THREE.Points(bgGeo, bgMat);
  scene.add(bgParticles);

  /* ── Floating 3D Geometry Shapes ── */
  const floaters = [];
  const fGeos = [
    new THREE.OctahedronGeometry(3.5),
    new THREE.TetrahedronGeometry(3),
    new THREE.IcosahedronGeometry(2.5),
    new THREE.DodecahedronGeometry(2.8),
    new THREE.BoxGeometry(3.5, 3.5, 3.5),
  ];
  for (let i = 0; i < 10; i++) {
    const geo  = fGeos[i % fGeos.length];
    const mat  = new THREE.MeshBasicMaterial({
      color: i % 2 === 0 ? 0x722F37 : 0x9b3f4a,
      wireframe: true, transparent: true, opacity: 0.2 + Math.random() * 0.2
    });
    const mesh = new THREE.Mesh(geo, mat);
    // Place them around the screen edges away from globe center
    const angle = (i / 10) * Math.PI * 2;
    const dist  = 35 + Math.random() * 20;
    mesh.position.set(
      Math.cos(angle) * dist,
      (Math.random() - 0.5) * 40,
      (Math.random() - 0.5) * 20 - 10
    );
    mesh.userData = {
      rotX:        (Math.random() - 0.5) * 0.018,
      rotY:        (Math.random() - 0.5) * 0.018,
      floatOffset: Math.random() * Math.PI * 2,
      initY:       mesh.position.y,
    };
    scene.add(mesh);
    floaters.push(mesh);
  }

  /* ── Connecting lines between nearby floaters ── */
  for (let i = 0; i < floaters.length - 1; i++) {
    const pts = [floaters[i].position, floaters[i+1].position];
    const lGeo = new THREE.BufferGeometry().setFromPoints(pts);
    const lMat = new THREE.LineBasicMaterial({ color: 0x722F37, transparent: true, opacity: 0.1 });
    scene.add(new THREE.Line(lGeo, lMat));
  }

  /* ── Mouse parallax ── */
  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth  - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  let heroVisible = true;
  new IntersectionObserver(e => { heroVisible = e[0].isIntersecting; })
    .observe(document.getElementById('hero'));

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    if (!heroVisible) return;
    t += 0.006;

    // Globe rotation
    globeGroup.rotation.y += 0.0025;
    globeGroup.rotation.x  = Math.sin(t * 0.3) * 0.12;

    // Counter-rotating icosahedron layer
    midMesh.rotation.y -= 0.004;
    midMesh.rotation.z += 0.002;

    // Rings spin
    ring1.rotation.z += 0.008;
    ring2.rotation.z -= 0.005;
    ring3.rotation.z += 0.003;

    // Background stars drift
    bgParticles.rotation.y += 0.0002;

    // Camera mouse parallax
    camera.position.x += (mx * 10 - camera.position.x) * 0.04;
    camera.position.y += (-my * 6  - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);

    // Floaters
    floaters.forEach(mesh => {
      const u = mesh.userData;
      mesh.rotation.x += u.rotX;
      mesh.rotation.y += u.rotY;
      mesh.position.y  = u.initY + Math.sin(t + u.floatOffset) * 2.5;
    });

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();

/* =====================================================
   THREE.JS – ABOUT SPHERE (Enhanced: Rings + Network)
   ===================================================== */
(function initSphere() {
  const canvas = document.getElementById('sphere-canvas');
  if (!window.THREE || !canvas) return;

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(0, 0, 3.8);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  function setSize() {
    const s = Math.min(canvas.parentElement.clientWidth, 340);
    renderer.setSize(s, s);
  }
  setSize();

  const group = new THREE.Group();
  scene.add(group);

  // Outer wireframe sphere
  const outerGeo = new THREE.SphereGeometry(1.3, 36, 36);
  const outerMat = new THREE.MeshBasicMaterial({ color: 0x722F37, wireframe: true, transparent: true, opacity: 0.25 });
  group.add(new THREE.Mesh(outerGeo, outerMat));

  // Mid icosahedron
  const icoGeo = new THREE.IcosahedronGeometry(1, 2);
  const icoMat = new THREE.MeshBasicMaterial({ color: 0x9b3f4a, wireframe: true, transparent: true, opacity: 0.18 });
  const icoMesh = new THREE.Mesh(icoGeo, icoMat);
  group.add(icoMesh);

  // Inner solid
  const innerGeo = new THREE.SphereGeometry(0.7, 32, 32);
  const innerMat = new THREE.MeshBasicMaterial({ color: 0x2a0c10, transparent: true, opacity: 0.95 });
  const innerMesh = new THREE.Mesh(innerGeo, innerMat);
  group.add(innerMesh);

  // Surface nodes
  const sCount = 120;
  const sPos   = new Float32Array(sCount * 3);
  for (let i = 0; i < sCount; i++) {
    const phi   = Math.acos(2 * Math.random() - 1);
    const theta = Math.random() * Math.PI * 2;
    const r     = 1.32;
    sPos[i*3]   = r * Math.sin(phi) * Math.cos(theta);
    sPos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
    sPos[i*3+2] = r * Math.cos(phi);
  }
  const sGeo = new THREE.BufferGeometry();
  sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3));
  group.add(new THREE.Points(sGeo, new THREE.PointsMaterial({ color: 0xcc4455, size: 0.035, transparent: true, opacity: 1 })));

  // Three orbit rings
  function addRing(r, tilt, color) {
    const pts = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r));
    }
    const geo  = new THREE.BufferGeometry().setFromPoints(pts);
    const mat  = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.6 });
    const ring = new THREE.LineLoop(geo, mat);
    ring.rotation.x = tilt;
    group.add(ring);
    return ring;
  }
  const r1 = addRing(1.55, 0,             0x722F37);
  const r2 = addRing(1.62, Math.PI * 0.4, 0x9b3f4a);
  const r3 = addRing(1.70, Math.PI * 0.7, 0x4e1f25);

  // Orbiting glowing dot on ring1
  const dotGeo = new THREE.SphereGeometry(0.045, 8, 8);
  const dotMat = new THREE.MeshBasicMaterial({ color: 0xff6677 });
  const dot1   = new THREE.Mesh(dotGeo, dotMat);
  group.add(dot1);
  const dot2 = new THREE.Mesh(dotGeo.clone(), dotMat.clone());
  dot2.material.color.set(0xdd9900);
  group.add(dot2);

  let sphereVisible = false;
  new IntersectionObserver(e => { sphereVisible = e[0].isIntersecting; })
    .observe(document.getElementById('about'));

  let t = 0;
  function animSphere() {
    requestAnimationFrame(animSphere);
    if (!sphereVisible) return;
    t += 0.012;

    group.rotation.y   += 0.005;
    icoMesh.rotation.y -= 0.007;
    icoMesh.rotation.z += 0.003;
    innerMesh.rotation.y -= 0.004;

    r1.rotation.z += 0.012;
    r2.rotation.z -= 0.008;
    r3.rotation.z += 0.005;

    // Dot follows ring1 path
    dot1.position.set(Math.cos(t * 0.9) * 1.55, Math.sin(t * 0.9) * 0, Math.sin(t * 0.9) * 1.55);
    dot2.position.set(Math.cos(t * 0.6 + Math.PI) * 1.62, Math.sin(t * 1.2) * 0.6, Math.sin(t * 0.6 + Math.PI) * 1.62);

    renderer.render(scene, camera);
  }
  animSphere();

  window.addEventListener('resize', setSize);
})();

/* ============================
   3D TILT CARDS – Enhanced
   ============================ */
function initTiltCards() {
  document.querySelectorAll('.tilt-card').forEach(card => {
    let animFrame;

    card.addEventListener('mousemove', e => {
      cancelAnimationFrame(animFrame);
      const rect  = card.getBoundingClientRect();
      const relX  = e.clientX - rect.left;
      const relY  = e.clientY - rect.top;
      const cx    = rect.width  / 2;
      const cy    = rect.height / 2;
      const tiltX = ((relY - cy) / cy) * -14;
      const tiltY = ((relX - cx) / cx) *  14;
      const gX    = Math.round((relX / rect.width)  * 100);
      const gY    = Math.round((relY / rect.height) * 100);

      card.style.transform         = `perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.04) translateZ(10px)`;
      card.style.boxShadow         = `0 25px 60px rgba(0,0,0,0.5), 0 0 40px rgba(114,47,55,0.3)`;
      card.style.setProperty('--gx', gX + '%');
      card.style.setProperty('--gy', gY + '%');
    });

    card.addEventListener('mouseleave', () => {
      // Smooth spring-back
      let currentRotX = parseFloat(card.style.transform.match(/rotateX\(([-\d.]+)/)?.[1]) || 0;
      let currentRotY = parseFloat(card.style.transform.match(/rotateY\(([-\d.]+)/)?.[1]) || 0;

      function springBack() {
        currentRotX *= 0.80;
        currentRotY *= 0.80;
        if (Math.abs(currentRotX) < 0.05 && Math.abs(currentRotY) < 0.05) {
          card.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1) translateZ(0px)';
          card.style.boxShadow = '';
          return;
        }
        card.style.transform = `perspective(600px) rotateX(${currentRotX}deg) rotateY(${currentRotY}deg) scale(1) translateZ(0px)`;
        animFrame = requestAnimationFrame(springBack);
      }
      animFrame = requestAnimationFrame(springBack);
    });
  });
}
initTiltCards();

/* ============================
   INTERSECTION OBSERVER
   ============================ */
const fadeEls = document.querySelectorAll('.fade-in');
const fadeObs = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      fadeObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
fadeEls.forEach(el => fadeObs.observe(el));

// Skill bars
const skillObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(fill => {
        setTimeout(() => { fill.style.width = fill.dataset.pct + '%'; }, 200);
      });
      skillObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.skills-grid').forEach(el => skillObs.observe(el));

// Counters
function animateCounter(el, target, duration = 1800) {
  let start = null;
  function step(ts) {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    el.textContent = Math.round((1 - Math.pow(1 - progress, 3)) * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  }
  requestAnimationFrame(step);
}
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number').forEach(el => {
        animateCounter(el, parseInt(el.dataset.target, 10));
      });
      counterObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });
const aboutSection = document.getElementById('about');
if (aboutSection) counterObs.observe(aboutSection);

/* ============================
   PARALLAX
   ============================ */
window.addEventListener('scroll', () => {
  const sy = window.scrollY;
  const heroContent = document.querySelector('.hero-content');
  if (heroContent && sy < window.innerHeight) {
    heroContent.style.transform = `translateY(${sy * 0.3}px)`;
    heroContent.style.opacity   = Math.max(0, 1 - sy / (window.innerHeight * 0.65));
  }
}, { passive: true });

/* ============================
   CONTACT FORM
   ============================ */
const form       = document.getElementById('contact-form');
const formSubmit = document.getElementById('form-submit');
const btnText    = document.getElementById('btn-text');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    btnText.textContent         = 'Message Sent! ✓';
    formSubmit.disabled         = true;
    formSubmit.style.background = '#2a6e4a';
    setTimeout(() => {
      btnText.textContent         = 'Send Message';
      formSubmit.disabled         = false;
      formSubmit.style.background = '';
      form.reset();
    }, 3500);
  });
}

/* ============================
   ACTIVE NAV LINK
   ============================ */
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  const sy = window.scrollY + 120;
  sections.forEach(sec => {
    if (sy >= sec.offsetTop && sy < sec.offsetTop + sec.offsetHeight) {
      navItems.forEach(a => {
        a.style.color = '';
        if (a.getAttribute('href') === '#' + sec.id) a.style.color = '#722F37';
      });
    }
  });
}, { passive: true });
