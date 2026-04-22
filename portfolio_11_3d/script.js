/* ─────────────────────────────────────────────────
   HARSHIT DIWAKER  ·  3D PORTFOLIO  ·  script.js
   Three.js · Dark/Light Toggle · All Interactions
───────────────────────────────────────────────── */
'use strict';

/* ═══════════════ 1. LOADER ═══════════════ */
(function initLoader() {
  const fill   = document.getElementById('loader-fill');
  const text   = document.getElementById('loader-text');
  const loader = document.getElementById('loader');
  const msgs   = ['Initializing...', 'Loading 3D engine...', 'Building scene...', 'Almost ready...', 'Welcome!'];
  let pct = 0;
  const iv = setInterval(() => {
    pct += Math.random() * 16 + 5;
    if (pct >= 100) pct = 100;
    fill.style.width = pct + '%';
    text.textContent = msgs[Math.min(Math.floor(pct / 25), msgs.length - 1)];
    if (pct >= 100) {
      clearInterval(iv);
      setTimeout(() => { loader.classList.add('hidden'); startAll(); }, 600);
    }
  }, 80);
})();

/* ═══════════════ 2. DARK / LIGHT MODE ═══════════════ */
(function initTheme() {
  const toggle = document.getElementById('theme-toggle');
  const html   = document.documentElement;

  // Restore saved preference
  const saved = localStorage.getItem('hd-theme');
  if (saved) html.setAttribute('data-theme', saved);

  toggle.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('hd-theme', next);
  });
})();

/* ═══════════════ 3. CUSTOM CURSOR ═══════════════ */
(function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  let fX = 0, fY = 0, cX = 0, cY = 0;

  document.addEventListener('mousemove', e => { cX = e.clientX; cY = e.clientY; });

  (function animCursor() {
    fX += (cX - fX) * 0.13;
    fY += (cY - fY) * 0.13;
    cursor.style.left   = cX + 'px';
    cursor.style.top    = cY + 'px';
    follower.style.left = fX + 'px';
    follower.style.top  = fY + 'px';
    requestAnimationFrame(animCursor);
  })();

  document.querySelectorAll('a, button, .skill-category, .project-card, .cert-card, .contact-card, .service-card, .ski-item, .filter-btn').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.classList.add('hovered'); follower.classList.add('hovered'); });
    el.addEventListener('mouseleave', () => { cursor.classList.remove('hovered'); follower.classList.remove('hovered'); });
  });
})();

/* ═══════════════ 4. SCROLL PROGRESS BAR ═══════════════ */
(function initScrollProgress() {
  const bar = document.getElementById('scroll-progress-bar');
  window.addEventListener('scroll', () => {
    const total  = document.body.scrollHeight - window.innerHeight;
    const pct    = (window.scrollY / total) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

/* ═══════════════ 5. BACK TO TOP ═══════════════ */
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  window.addEventListener('scroll', () => btn.classList.toggle('visible', window.scrollY > 400), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();

/* ═══════════════ 6. THREE.JS BACKGROUND ═══════════════ */
function initThreeJS() {
  const canvas   = document.getElementById('bg-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.z = 400;

  /* ─ Stars ─ */
  const starGeo = new THREE.BufferGeometry();
  const CNT = 1800;
  const starPos = new Float32Array(CNT * 3);
  for (let i = 0; i < CNT; i++) {
    starPos[i * 3]     = (Math.random() - .5) * 2000;
    starPos[i * 3 + 1] = (Math.random() - .5) * 2000;
    starPos[i * 3 + 2] = (Math.random() - .5) * 2000;
  }
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({ color: 0x93C5FD, size: 1.2, sizeAttenuation: true, transparent: true, opacity: 0.65 });
  scene.add(new THREE.Points(starGeo, starMat));

  /* ─ Wireframe shapes ─ */
  const shapes = [];
  const cfgs = [
    { geo: new THREE.OctahedronGeometry(18, 0),  col: 0x1A56DB, x: -180, y:  80, z: -100 },
    { geo: new THREE.TetrahedronGeometry(14, 0), col: 0x2563EB, x:  200, y: -60, z:  -80 },
    { geo: new THREE.IcosahedronGeometry(12, 0), col: 0x3B82F6, x: -240, y:-120, z: -120 },
    { geo: new THREE.OctahedronGeometry(10, 0),  col: 0x1D4ED8, x:  160, y: 130, z:  -60 },
    { geo: new THREE.TetrahedronGeometry(22, 0), col: 0x1E40AF, x:  -80, y:-180, z: -150 },
  ];
  cfgs.forEach(c => {
    const mat  = new THREE.MeshPhongMaterial({ color: c.col, wireframe: true, transparent: true, opacity: 0.22 });
    const mesh = new THREE.Mesh(c.geo, mat);
    mesh.position.set(c.x, c.y, c.z);
    mesh.userData = { vX: (Math.random()-.5)*.005, vY: (Math.random()-.5)*.005, phase: Math.random()*Math.PI*2 };
    scene.add(mesh); shapes.push(mesh);
  });

  /* ─ Grid ─ */
  const grid = new THREE.GridHelper(1000, 35, 0x1A56DB, 0x0D1F3C);
  grid.position.y = -260;
  grid.material.transparent = true;
  grid.material.opacity = 0.18;
  scene.add(grid);

  /* ─ Floating node network ─ */
  const NODE_COUNT = 60;
  const nodePos  = new Float32Array(NODE_COUNT * 3);
  const nodeVel  = [];
  for (let i = 0; i < NODE_COUNT; i++) {
    nodePos[i*3]   = (Math.random()-.5)*700;
    nodePos[i*3+1] = (Math.random()-.5)*500;
    nodePos[i*3+2] = (Math.random()-.5)*300 - 50;
    nodeVel.push({ x:(Math.random()-.5)*.4, y:(Math.random()-.5)*.4, z:(Math.random()-.5)*.2 });
  }
  const nodeGeo = new THREE.BufferGeometry();
  nodeGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(nodePos), 3));
  const nodeMat = new THREE.PointsMaterial({ color: 0x3B82F6, size: 2.8, transparent: true, opacity: 0.45 });
  const nodes = new THREE.Points(nodeGeo, nodeMat);
  scene.add(nodes);

  /* ─ Lights ─ */
  scene.add(new THREE.AmbientLight(0x0A1628, 1));
  const pL1 = new THREE.PointLight(0x1A56DB, 2, 700);
  pL1.position.set(0, 100, 100); scene.add(pL1);
  const pL2 = new THREE.PointLight(0x3B82F6, 1.2, 500);
  pL2.position.set(-200, -100, 0); scene.add(pL2);

  /* ─ Mouse parallax ─ */
  let mX = 0, mY = 0;
  document.addEventListener('mousemove', e => { mX = (e.clientX/window.innerWidth-.5)*2; mY = (e.clientY/window.innerHeight-.5)*2; });

  /* ─ Resize ─ */
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  /* ─ Loop ─ */
  const clock = new THREE.Clock();
  (function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();

    shapes.forEach(s => {
      s.rotation.x += s.userData.vX;
      s.rotation.y += s.userData.vY;
      s.position.y += Math.sin(t*.5 + s.userData.phase) * .07;
    });

    const np = nodeGeo.attributes.position.array;
    for (let i = 0; i < NODE_COUNT; i++) {
      np[i*3]   += nodeVel[i].x; np[i*3+1] += nodeVel[i].y; np[i*3+2] += nodeVel[i].z;
      if (Math.abs(np[i*3])   > 350) nodeVel[i].x *= -1;
      if (Math.abs(np[i*3+1]) > 250) nodeVel[i].y *= -1;
      if (Math.abs(np[i*3+2]) > 150) nodeVel[i].z *= -1;
    }
    nodeGeo.attributes.position.needsUpdate = true;

    camera.position.x += (mX*30 - camera.position.x) * .02;
    camera.position.y += (-mY*20 - camera.position.y) * .02;
    camera.lookAt(scene.position);

    pL1.intensity = 2 + Math.sin(t*1.2) * .6;
    renderer.render(scene, camera);
  })();
}

/* ═══════════════ 7. NAVBAR ═══════════════ */
function initNavbar() {
  const nav    = document.getElementById('navbar');
  const ham    = document.getElementById('hamburger');
  const menu   = document.getElementById('mobile-menu');
  const close  = document.getElementById('mobile-close');

  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 50), { passive: true });

  function openMenu(open) {
    menu.classList.toggle('open', open);
    const s = ham.querySelectorAll('span');
    s[0].style.transform = open ? 'rotate(45deg) translate(5px,5px)'  : '';
    s[1].style.opacity   = open ? '0' : '1';
    s[2].style.transform = open ? 'rotate(-45deg) translate(5px,-5px)' : '';
  }
  ham.addEventListener('click', () => openMenu(!menu.classList.contains('open')));
  close.addEventListener('click', () => openMenu(false));
  document.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', () => openMenu(false)));
}

/* ═══════════════ 8. TYPED TEXT ═══════════════ */
function initTyped() {
  const roles = ['Data Analyst','Python Developer','SQL Enthusiast','Power BI Designer','Insight Explorer'];
  const el = document.getElementById('typed-role');
  let rIdx = 0, cIdx = 0, del = false;
  function type() {
    const r = roles[rIdx];
    if (!del) {
      el.textContent = r.slice(0, ++cIdx);
      if (cIdx === r.length) { del = true; setTimeout(type, 1800); return; }
    } else {
      el.textContent = r.slice(0, --cIdx);
      if (cIdx === 0) { del = false; rIdx = (rIdx+1) % roles.length; }
    }
    setTimeout(type, del ? 60 : 100);
  }
  type();
}

/* ═══════════════ 9. CIRCULAR SKILL RINGS ═══════════════ */
function initSkillRings() {
  // Inject SVG gradient def into each ring SVG
  document.querySelectorAll('.ring-svg').forEach(svg => {
    const defs = document.createElementNS('http://www.w3.org/2000/svg','defs');
    const id   = 'rg-' + Math.random().toString(36).slice(2,7);
    defs.innerHTML = `
      <linearGradient id="${id}" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%"   stop-color="#1A56DB"/>
        <stop offset="100%" stop-color="#60A5FA"/>
      </linearGradient>`;
    svg.insertBefore(defs, svg.firstChild);
    const fill = svg.querySelector('.ring-fill');
    fill.setAttribute('stroke', `url(#${id})`);
  });

  // Animate on scroll
  const items = document.querySelectorAll('.ring-fill');
  const pctEls = document.querySelectorAll('.ring-pct');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const pct      = parseFloat(e.target.dataset.pct);
      const circ     = 2 * Math.PI * 50; // r=50 → 314.16
      const offset   = circ - (pct / 100) * circ;
      e.target.style.strokeDashoffset = offset;

      // counter for matching pct label
      const idx = Array.from(items).indexOf(e.target);
      if (pctEls[idx]) {
        const target = parseInt(pctEls[idx].dataset.target, 10);
        let cur = 0;
        const iv = setInterval(() => {
          cur = Math.min(cur + 2, target);
          pctEls[idx].textContent = cur;
          if (cur >= target) clearInterval(iv);
        }, 18);
      }
      obs.unobserve(e.target);
    });
  }, { threshold: 0.5 });
  items.forEach(i => obs.observe(i));
}

/* ═══════════════ 10. SKILL BAR ANIMATION ═══════════════ */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-fill');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.width + '%';
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  bars.forEach(b => obs.observe(b));
}

/* ═══════════════ 11. STAT COUNTERS ═══════════════ */
function initCounters() {
  const stats = document.querySelectorAll('.stat-num');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const target = parseInt(e.target.dataset.target, 10);
      let cur = 0;
      const step = Math.max(1, target / 40);
      const iv = setInterval(() => {
        cur = Math.min(cur + step, target);
        e.target.textContent = Math.floor(cur);
        if (cur >= target) clearInterval(iv);
      }, 40);
      obs.unobserve(e.target);
    });
  }, { threshold: 0.8 });
  stats.forEach(s => obs.observe(s));
}

/* ═══════════════ 12. SCROLL REVEAL ═══════════════ */
function initReveal() {
  const els = document.querySelectorAll('.reveal-up');
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('revealed'), i * 80);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  els.forEach(r => obs.observe(r));

  // General card reveal
  const cards = document.querySelectorAll('.skill-category, .project-card, .cert-card, .contact-card, .service-card, .timeline-item');
  const cObs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => { e.target.style.opacity = '1'; e.target.style.transform = 'translateY(0)'; }, i * 100);
      }
    });
  }, { threshold: 0.1 });
  cards.forEach(c => {
    c.style.opacity = '0'; c.style.transform = 'translateY(28px)';
    c.style.transition = 'opacity .6s ease, transform .6s ease';
    cObs.observe(c);
  });
}

/* ═══════════════ 13. 3D TILT ═══════════════ */
function initTilt() {
  function tiltEffect(wrapper, inner, xMul, yMul) {
    wrapper.addEventListener('mousemove', e => {
      const r = wrapper.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width  - .5;
      const y = (e.clientY - r.top)  / r.height - .5;
      inner.style.transform = `rotateY(${x*xMul}deg) rotateX(${-y*yMul}deg)`;
    });
    wrapper.addEventListener('mouseleave', () => { inner.style.transform = ''; });
  }
  const heroCard = document.getElementById('hero-3d-card');
  if (heroCard) tiltEffect(heroCard, heroCard.querySelector('.card-inner'), 20, 15);
  const aCard = document.getElementById('about-card-3d');
  if (aCard) tiltEffect(aCard, aCard.querySelector('.about-card-face'), 12, 8);
}

/* ═══════════════ 14. ACTIVE NAV HIGHLIGHT ═══════════════ */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        links.forEach(l => l.classList.toggle('active', l.dataset.section === id));
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(s => obs.observe(s));
}

/* ═══════════════ 15. PROJECT FILTER ═══════════════ */
function initProjectFilter() {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      cards.forEach(c => {
        const tags = c.dataset.tags || '';
        const show = f === 'all' || tags.includes(f);
        c.classList.toggle('hidden', !show);
      });
    });
  });
}

/* ═══════════════ 16. CONTACT FORM ═══════════════ */
function initContactForm() {
  const form    = document.getElementById('contact-form');
  const btn     = document.getElementById('submit-btn');
  const btnText = document.getElementById('submit-text');
  const success = document.getElementById('form-success');
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const name  = document.getElementById('cf-name').value.trim();
    const email = document.getElementById('cf-email').value.trim();
    const msg   = document.getElementById('cf-message').value.trim();
    if (!name || !email || !msg) { alert('Please fill in all required fields.'); return; }
    btnText.textContent = 'Sending...';
    btn.disabled = true; btn.style.opacity = '.7';
    setTimeout(() => {
      btnText.textContent = 'Send Message';
      btn.disabled = false; btn.style.opacity = '1';
      form.reset();
      success.classList.add('show');
      setTimeout(() => success.classList.remove('show'), 5000);
    }, 1800);
  });
}

/* ═══════════════ BOOT ═══════════════ */
function startAll() {
  initThreeJS();
  initNavbar();
  initTyped();
  initSkillRings();
  initSkillBars();
  initCounters();
  initReveal();
  initTilt();
  initActiveNav();
  initProjectFilter();
  initContactForm();

  // Hero stagger reveal
  const heroEls = document.querySelectorAll('.hero .reveal-up');
  heroEls.forEach((el, i) => setTimeout(() => el.classList.add('revealed'), 200 + i*150));
}
