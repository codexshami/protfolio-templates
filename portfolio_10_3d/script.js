/* ===================================================================
   Arpita Singh – 3D Portfolio JavaScript
   Features: Theme toggle, particles, scroll reveals, tilt, nav
   =================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ─── Theme Toggle ───────────────────────────────────────────
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    // Load saved preference or default to dark
    const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('portfolio-theme', next);

        // Re-init particles with new theme colours
        initParticles();
    });

    // ─── Mobile Navigation ──────────────────────────────────────
    const hamburger = document.getElementById('hamburger');
    const navLinks  = document.getElementById('navLinks');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('open');
    });

    // Close mobile nav on link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('open');
        });
    });

    // ─── Navbar Shrink on Scroll ────────────────────────────────
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ─── Active Nav Link Highlighting ───────────────────────────
    const sections = document.querySelectorAll('section[id]');
    const navLinkElements = document.querySelectorAll('.nav-link');

    function highlightNav() {
        const scrollY = window.scrollY + 200;
        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollY >= top && scrollY < top + height) {
                navLinkElements.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }
    window.addEventListener('scroll', highlightNav);

    // ─── Scroll Reveal ──────────────────────────────────────────
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ─── Timeline Toggles ───────────────────────────────────────
    document.querySelectorAll('.timeline-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const details = btn.previousElementSibling;
            const isOpen = details.classList.contains('open');

            details.classList.toggle('open');
            btn.classList.toggle('open');
            btn.querySelector('span').textContent = isOpen ? 'View Details' : 'Hide Details';
        });
    });

    // ─── Contact Form Handler ───────────────────────────────────
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = contactForm.querySelector('button[type="submit"]');
        const originalHTML = btn.innerHTML;

        btn.innerHTML = '<span>Message Sent! ✓</span>';
        btn.style.background = '#10B981';
        btn.disabled = true;

        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
            btn.disabled = false;
            contactForm.reset();
        }, 3000);
    });

    // ─── Smooth Scroll ──────────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ─── Particle Field (Canvas) ────────────────────────────────
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function getParticleColor() {
        const theme = html.getAttribute('data-theme');
        return theme === 'dark'
            ? 'rgba(168, 85, 247, 0.45)'
            : 'rgba(124, 58, 237, 0.25)';
    }

    function getLineColor() {
        const theme = html.getAttribute('data-theme');
        return theme === 'dark'
            ? 'rgba(168, 85, 247, 0.08)'
            : 'rgba(124, 58, 237, 0.06)';
    }

    function resizeCanvas() {
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.5 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.6;
            this.speedY = (Math.random() - 0.5) * 0.6;
            this.opacity = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width)  this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = getParticleColor();
            ctx.globalAlpha = this.opacity;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    function initParticles() {
        cancelAnimationFrame(animationId);
        resizeCanvas();

        const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120);
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }

        animateParticles();
    }

    function drawLines() {
        const maxDist = 130;
        const lineColor = getLineColor();

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxDist) {
                    ctx.beginPath();
                    ctx.strokeStyle = lineColor;
                    ctx.globalAlpha = 1 - (dist / maxDist);
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        drawLines();
        animationId = requestAnimationFrame(animateParticles);
    }

    window.addEventListener('resize', () => {
        resizeCanvas();
    });

    initParticles();

    // ─── Vanilla Tilt Init ──────────────────────────────────────
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll('[data-tilt]'), {
            max: 12,
            speed: 400,
            glare: true,
            'max-glare': 0.2,
            perspective: 1000,
        });
    }
});
