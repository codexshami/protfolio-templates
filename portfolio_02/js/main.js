/* =====================================================
   RUMI PORTFOLIO — MAIN JS
   GSAP Animations, Typing Effect, Scroll Reveals,
   Navbar, Theme Toggle, Counter, Form
   ===================================================== */

(function () {
  'use strict';

  /* ─── GSAP Register Plugins ─── */
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  /* ─────────────────────────────────
     1. TYPING EFFECT
  ───────────────────────────────── */
  const roles = [
    'Data Science Student',
    'AI Developer',
    'ML Engineer',
    'Problem Solver',
    'Data Analyst',
  ];
  const typingEl = document.getElementById('typing-text');
  let roleIdx = 0, charIdx = 0, isDeleting = false;

  function typeLoop() {
    if (!typingEl) return;
    const current = roles[roleIdx];
    const speed = isDeleting ? 45 : 80;

    if (!isDeleting) {
      typingEl.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        setTimeout(() => { isDeleting = true; typeLoop(); }, 1800);
        return;
      }
    } else {
      typingEl.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, speed);
  }
  setTimeout(typeLoop, 800);


  /* ─────────────────────────────────
     2. NAVBAR — scroll + hamburger
  ───────────────────────────────── */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  const allNavLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
    updateActiveLink();
  }, { passive: true });

  hamburger && hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  allNavLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburger && hamburger.classList.remove('open');
      navLinks && navLinks.classList.remove('open');
    });
  });

  function updateActiveLink() {
    const sections = document.querySelectorAll('.section');
    let active = '';
    sections.forEach(sec => {
      const top = sec.getBoundingClientRect().top;
      if (top < window.innerHeight * 0.5) active = sec.id;
    });
    allNavLinks.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + active);
    });
  }
  updateActiveLink();


  /* ─────────────────────────────────
     3. THEME TOGGLE
  ───────────────────────────────── */
  const themeBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  let isDark = true;

  themeBtn && themeBtn.addEventListener('click', () => {
    isDark = !isDark;
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
  });


  /* ─────────────────────────────────
     4. SCROLL REVEAL
  ───────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  if ('IntersectionObserver' in window) {
    const revealIO = new IntersectionObserver((entries) => {
      entries.forEach(el => {
        if (el.isIntersecting) {
          const delay = el.target.dataset.delay ? parseInt(el.target.dataset.delay) : 0;
          setTimeout(() => el.target.classList.add('revealed'), delay);
          revealIO.unobserve(el.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(el => revealIO.observe(el));
  } else {
    // Fallback: reveal all
    revealEls.forEach(el => el.classList.add('revealed'));
  }


  /* ─────────────────────────────────
     5. SKILL BARS ANIMATION
  ───────────────────────────────── */
  const skillFills = document.querySelectorAll('.skill-fill');

  if ('IntersectionObserver' in window) {
    const skillIO = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.width = e.target.dataset.width + '%';
          skillIO.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });

    skillFills.forEach(f => skillIO.observe(f));
  }


  /* ─────────────────────────────────
     6. STAT COUNTER
  ───────────────────────────────── */
  const statNums = document.querySelectorAll('.stat-num');

  function animateCounter(el, target, duration = 1600) {
    let start = null;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      // Ease out
      const ease = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(ease * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target + '+';
    };
    requestAnimationFrame(step);
  }

  if ('IntersectionObserver' in window) {
    const counterIO = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateCounter(e.target, parseInt(e.target.dataset.target));
          counterIO.unobserve(e.target);
        }
      });
    }, { threshold: 0.5 });

    statNums.forEach(n => counterIO.observe(n));
  }


  /* ─────────────────────────────────
     7. PROJECT CARDS — 3D Tilt
  ───────────────────────────────── */
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `perspective(800px) rotateY(${dx * 8}deg) rotateX(${-dy * 6}deg) translateY(-8px) scale(1.02)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  /* ─────────────────────────────────
     8. CONTACT FORM
  ───────────────────────────────── */
  const contactForm = document.getElementById('contact-form');
  const formStatus = document.getElementById('form-status');
  const sendBtn = document.getElementById('send-btn');

  contactForm && contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendBtn.disabled = true;
    sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    // Simulate async send (replace with actual fetch to backend)
    setTimeout(() => {
      formStatus.textContent = '✅ Message sent! I\'ll get back to you soon.';
      formStatus.className = 'form-status success';
      contactForm.reset();
      sendBtn.disabled = false;
      sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message <span class="btn-ripple"></span>';
      setTimeout(() => { formStatus.textContent = ''; formStatus.className = 'form-status'; }, 5000);
    }, 1800);
  });


  /* ─────────────────────────────────
     9. SMOOTH SCROLL
  ───────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = target.getBoundingClientRect().top + window.scrollY - 70;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    });
  });


  /* ─────────────────────────────────
     10. GSAP Hero Entrance (if available)
  ───────────────────────────────── */
  if (typeof gsap !== 'undefined') {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.hero-badge', { opacity: 0, y: 30, duration: 0.7, delay: 0.3 })
      .from('.hero-name', { opacity: 0, y: 50, duration: 0.9 }, '-=0.3')
      .from('.hero-subtitle', { opacity: 0, y: 30, duration: 0.7 }, '-=0.5')
      .from('.hero-btns', { opacity: 0, y: 30, duration: 0.7 }, '-=0.4')
      .from('.hero-stats .stat-item', { opacity: 0, y: 20, stagger: 0.12, duration: 0.6 }, '-=0.3')
      .from('.hero-scroll-hint', { opacity: 0, duration: 0.5 }, '-=0.2');
  }


  /* ─────────────────────────────────
     11. GLITCH INPUT LABEL ANIMATION
  ───────────────────────────────── */
  document.querySelectorAll('.input-wrapper input, .input-wrapper textarea').forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.querySelector('.input-icon').style.color = 'var(--purple-light)';
    });
    input.addEventListener('blur', () => {
      input.parentElement.querySelector('.input-icon').style.color = '';
    });
  });


  /* ─────────────────────────────────
     12. TIMELINE LINE DRAW (CSS-based IntersectionObserver)
  ───────────────────────────────── */
  document.querySelectorAll('.timeline-item').forEach((item, i) => {
    item.style.transitionDelay = (i * 80) + 'ms';
  });

})();
