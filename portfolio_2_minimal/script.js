gsap.registerPlugin(ScrollTrigger);

// Custom Cursor (Only on Desktop)
if(window.innerWidth > 768) {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    const links = document.querySelectorAll('a, .menu-btn');

    document.addEventListener('mousemove', (e) => {
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1 });
        gsap.to(follower, { x: e.clientX, y: e.clientY, duration: 0.3 });
    });

    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
        });
        link.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
        });
    });
}

// Hero Animations
gsap.from('.reveal-text', {
    y: 150,
    opacity: 0,
    duration: 1.2,
    stagger: 0.2,
    ease: "power4.out",
    delay: 0.2
});

gsap.from('.fade-in', {
    opacity: 0,
    y: 20,
    duration: 1,
    delay: 1,
    stagger: 0.2
});

// Parallax Effects for Images
const parallaxBackgrounds = document.querySelectorAll('.parallax-bg');
parallaxBackgrounds.forEach(bg => {
    gsap.to(bg, {
        backgroundPosition: `50% 100%`,
        ease: "none",
        scrollTrigger: {
            trigger: bg,
            start: "top bottom",
            end: "bottom top",
            scrub: true
        }
    });
});

// Reveal Titles on Scroll
const revealTitles = document.querySelectorAll('.reveal-title');
revealTitles.forEach(title => {
    gsap.from(title, {
        scrollTrigger: {
            trigger: title,
            start: "top 90%",
            toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    });
});
