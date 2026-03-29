gsap.registerPlugin(ScrollTrigger);

// Hero Animations
const tl = gsap.timeline();

tl.from('.gold-line', {
    scaleX: 0,
    scaleY: 0,
    transformOrigin: "center center",
    duration: 1.5,
    ease: "power4.inOut",
    stagger: 0.2
})
.from('.logo, .nav-links li', {
    y: -20,
    opacity: 0,
    duration: 1,
    ease: "power2.out",
    stagger: 0.1
}, "-=1")
.from('.fade-up', {
    y: 40,
    opacity: 0,
    duration: 1.2,
    ease: "power3.out",
    stagger: 0.2
}, "-=0.5");

// Section entry animations
const sections = document.querySelectorAll('.section-padding');

sections.forEach(section => {
    gsap.from(section.querySelectorAll('.section-title, .collection-card, .lux-text, .expertise-item, .atelier-image, .lux-input'), {
        scrollTrigger: {
            trigger: section,
            start: "top 80%",
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        stagger: 0.15
    });
});
