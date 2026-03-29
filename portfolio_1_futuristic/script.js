// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// 1. Scroll Progress Bar
const progressBar = document.querySelector('.scroll-progress');
window.addEventListener('scroll', () => {
    const scrollPx = document.documentElement.scrollTop || document.body.scrollTop;
    const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = `${(scrollPx / winHeightPx) * 100}%`;
    progressBar.style.width = scrolled;
});

// 2. Three.js Background Particle System
const initThreeJS = () => {
    const canvasContainer = document.getElementById('canvas-container');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    canvasContainer.appendChild(renderer.domElement);

    // Create Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 700;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        // Spread particles
        posArray[i] = (Math.random() - 0.5) * 10;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    // Material
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: '#00f0ff',
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    // Mesh
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    camera.position.z = 3;

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX / window.innerWidth - 0.5;
        mouseY = event.clientY / window.innerHeight - 0.5;
    });

    // Animation Loop
    const clock = new THREE.Clock();

    const animate = () => {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Rotate particles slowly
        particlesMesh.rotation.y = elapsedTime * 0.05;
        particlesMesh.rotation.x = elapsedTime * 0.02;

        // Slight mouse follow
        particlesMesh.position.x += (mouseX * 0.5 - particlesMesh.position.x) * 0.05;
        particlesMesh.position.y += (-mouseY * 0.5 - particlesMesh.position.y) * 0.05;

        // Breathing color effect
        const hue = (elapsedTime * 0.1) % 1;
        particlesMaterial.color.setHSL(hue, 1, 0.5);

        renderer.render(scene, camera);
    };
    
    animate();

    // Resize Handler
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

initThreeJS();

// 3. GSAP Animations for sections
// Hero Animations
gsap.from('.nav-links li, .logo', {
    y: -50,
    opacity: 0,
    duration: 1,
    stagger: 0.1,
    ease: "power3.out"
});

gsap.from('.hero .glass-panel', {
    y: 100,
    opacity: 0,
    duration: 1.5,
    delay: 0.5,
    ease: "power4.out"
});

// Scroll Animations for Sections
const sections = gsap.utils.toArray('.section');

sections.forEach((section, i) => {
    if(i === 0) return; // Skip hero

    const children = section.querySelectorAll('.glass-card, .section-title');
    
    gsap.from(children, {
        scrollTrigger: {
            trigger: section,
            start: "top 80%",
            toggleActions: "play none none reverse"
        },
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out"
    });
});
