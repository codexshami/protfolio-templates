gsap.registerPlugin(ScrollTrigger);

// Three.js Retro Grid Background
const initRetroGrid = () => {
    const canvasContainer = document.getElementById('grid-canvas');
    if(!canvasContainer) return;
    
    const scene = new THREE.Scene();
    
    // Add fog for fading out in the distance
    scene.fog = new THREE.FogExp2(0x050505, 0.08);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 2, 8);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasContainer.appendChild(renderer.domElement);

    // Create Grid
    const gridGeometry = new THREE.PlaneGeometry(100, 100, 40, 40);
    
    // Displace vertices to create subtle terrain variations
    const positionAttribute = gridGeometry.attributes.position;
    for ( let i = 0; i < positionAttribute.count; i ++ ) {
        const x = positionAttribute.getX(i);
        const y = positionAttribute.getY(i);
        // Add minimal random height
        const z = Math.random() * 0.2;
        positionAttribute.setZ(i, z);
    }
    
    gridGeometry.computeVertexNormals();

    const gridMaterial = new THREE.MeshBasicMaterial({
        color: 0xff003c, // cyber red wireframe
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });

    const gridMesh = new THREE.Mesh(gridGeometry, gridMaterial);
    gridMesh.rotation.x = -Math.PI / 2;
    scene.add(gridMesh);

    // Grid Top (ceiling)
    const gridMeshTop = new THREE.Mesh(gridGeometry, gridMaterial);
    gridMeshTop.rotation.x = Math.PI / 2;
    gridMeshTop.position.y = 8;
    scene.add(gridMeshTop);

    // Animation Loop
    let speed = 0.05;
    
    const animate = () => {
        requestAnimationFrame(animate);
        
        // Move grid towards camera to simulate forward movement
        gridMesh.position.z += speed;
        gridMeshTop.position.z += speed;
        
        // Reset grid position to loop seamlessly (100 / 40 = 2.5)
        if (gridMesh.position.z > 2.5) { 
            gridMesh.position.z = 0;
            gridMeshTop.position.z = 0;
        }

        renderer.render(scene, camera);
    };

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

initRetroGrid();

// GSAP Animations
gsap.from('.hero-box', {
    y: 50,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    delay: 0.5
});

const sections = document.querySelectorAll('.cyber-section');
sections.forEach(sec => {
    if(sec.classList.contains('hero')) return;
    
    gsap.from(sec.querySelectorAll('.cyber-box, .section-header'), {
        scrollTrigger: {
            trigger: sec,
            start: 'top 85%',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out'
    });
});
