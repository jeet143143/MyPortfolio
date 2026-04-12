// Three.js setup for Premium 3D Background System
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) return;

    // SCENE SETUP
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020205, 0.0015);

    // CAMERA SETUP
    const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1500);
    camera.position.z = 40;

    // RENDERER SETUP
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Create soft gradient clear color instead of hard black
    renderer.setClearColor(0x050510, 0);

    // LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    scene.add(ambientLight);
    
    // Neon Cyan Light
    const pointLight1 = new THREE.PointLight(0x00f3ff, 4, 100);
    pointLight1.position.set(10, 10, 10);
    scene.add(pointLight1);

    // Neon Magenta Light
    const pointLight2 = new THREE.PointLight(0xff00cc, 4, 100);
    pointLight2.position.set(-10, -10, -10);
    scene.add(pointLight2);

    // HOLOGRAPHIC CORE (Torus Knot)
    const coreGeometry = new THREE.TorusKnotGeometry(6, 1.5, 200, 32);
    const coreMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x010101,
        metalness: 1.0,
        roughness: 0.1,
        transmission: 0.9, 
        ior: 1.8,
        thickness: 2.0,
        emissive: 0x00f3ff,
        emissiveIntensity: 0.15,
        wireframe: true,
        transparent: true,
        opacity: 0.8
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(coreMesh);

    // DYNAMIC PARTICLE VORTEX
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 6000;
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);
    const scaleArray = new Float32Array(particlesCount);
    
    const color1 = new THREE.Color(0x00f3ff); // Cyan
    const color2 = new THREE.Color(0xff00cc); // Magenta

    for(let i = 0; i < particlesCount; i++) {
        // Spherical distribution with a vortex twist bias
        const radius = Math.random() * Math.random() * 80 + 10;
        const angle = Math.random() * Math.PI * 2;
        const height = (Math.random() - 0.5) * 100;
        
        posArray[i*3] = Math.cos(angle) * radius; // X
        posArray[i*3+1] = height * (1 - Math.exp(-radius*0.05)); // Y: pinched vertically
        posArray[i*3+2] = Math.sin(angle) * radius; // Z
        
        // Colors lerped by radius depth
        const mixRatio = radius / 90;
        const mixedColor = color1.clone().lerp(color2, mixRatio + (Math.random() * 0.2));
        
        colorArray[i*3] = mixedColor.r;
        colorArray[i*3+1] = mixedColor.g;
        colorArray[i*3+2] = mixedColor.b;
        
        scaleArray[i] = Math.random();
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    particlesGeometry.setAttribute('aScale', new THREE.BufferAttribute(scaleArray, 1));

    // Custom Shader Material for glowing, size-pulsing particles
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.25,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.8,
        sizeAttenuation: true
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particleMaterial);
    scene.add(particlesMesh);

    // INTERACTIVITY VARIABLES
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    let scrollY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    // Mouse Tracking
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // Scroll Tracking for Camera Parallax Plunge
    window.addEventListener('scroll', () => {
        scrollY = window.scrollY;
    });

    const clock = new THREE.Clock();

    // ANIMATION LOOP
    const tick = () => {
        const elapsedTime = clock.getElapsedTime();

        // Complex Core Morphing & Rotation
        coreMesh.rotation.y = elapsedTime * 0.2;
        coreMesh.rotation.x = Math.sin(elapsedTime * 0.5) * 0.5;
        coreMesh.rotation.z = Math.cos(elapsedTime * 0.3) * 0.2;
        
        // Dynamic pulsating scale 
        const scaleVal = 1 + Math.sin(elapsedTime) * 0.05;
        coreMesh.scale.set(scaleVal, scaleVal, scaleVal);

        // Vortex Rotation
        particlesMesh.rotation.y = elapsedTime * 0.05;
        particlesMesh.rotation.x = Math.sin(elapsedTime * 0.1) * 0.1;

        // Interaction Parallax
        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;
        
        // Fluid Camera Movement (Reacting to Mouse + Scroll combined!)
        // Scroll dynamically pushes the camera THROUGH the core!
        const scrollEffectZ = Math.min(scrollY * 0.05, 50); 
        const scrollEffectY = -(scrollY * 0.02);

        camera.position.x += 0.05 * (targetX * 25 - camera.position.x);
        camera.position.y += 0.05 * (-targetY * 25 + scrollEffectY - camera.position.y);
        camera.position.z += 0.05 * ((40 - scrollEffectZ) - camera.position.z);
        
        const coreTarget = new THREE.Vector3(coreMesh.position.x, coreMesh.position.y - 5, coreMesh.position.z - (scrollEffectZ*0.5));
        camera.lookAt(coreTarget);

        renderer.render(scene, camera);
        window.requestAnimationFrame(tick);
    };

    tick();

    // RESIZE EVENT
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
});
