// Three.js setup for Particle Background
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) return;

    // SCENE SETUP
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050505, 0.002);

    // CAMERA SETUP
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 25;

    // RENDERER SETUP
    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true,
        powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // LIGHTING
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 3, 50);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0xaaaaaa, 2, 50);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);

    // HOLOGRAPHIC GEOMETRY (CORE)
    const coreGeometry = new THREE.IcosahedronGeometry(4, 1);
    const coreMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x111111,
        metalness: 0.9,
        roughness: 0.1,
        transmission: 0.95, // pure glass effect
        ior: 1.5,
        thickness: 0.5,
        emissive: 0xffffff,
        emissiveIntensity: 0.05,
        wireframe: true
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(coreMesh);

    // PARTICLES / GEOMETRY
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 4000;
    const posArray = new Float32Array(particlesCount * 3);
    const colorArray = new Float32Array(particlesCount * 3);
    const baseColor = new THREE.Color(0xffffff);
    const purpleColor = new THREE.Color(0x777777); // soft grey

    for(let i = 0; i < particlesCount * 3; i+=3) {
        posArray[i] = (Math.random() - 0.5) * 80; // X
        posArray[i+1] = (Math.random() - 0.5) * 80; // Y
        posArray[i+2] = (Math.random() - 0.5) * 80; // Z

        const mixRatio = Math.random();
        const mixedColor = baseColor.clone().lerp(purpleColor, mixRatio);
        colorArray[i] = mixedColor.r;
        colorArray[i+1] = mixedColor.g;
        colorArray[i+2] = mixedColor.b;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));

    const material = new THREE.PointsMaterial({
        size: 0.08,
        vertexColors: true,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.6
    });

    const particlesMesh = new THREE.Points(particlesGeometry, material);
    scene.add(particlesMesh);

    // Interactivity Support Variables
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    const clock = new THREE.Clock();

    // ANIMATION LOOP
    const tick = () => {
        const elapsedTime = clock.getElapsedTime();

        // Organic Core Rotation
        coreMesh.rotation.y += 0.005;
        coreMesh.rotation.x += 0.002;
        coreMesh.position.y = Math.sin(elapsedTime * 0.5) * 2;

        // Particle Mesh Rotation
        particlesMesh.rotation.y = elapsedTime * 0.02;
        particlesMesh.rotation.x = elapsedTime * 0.01;

        // Interaction Parallax
        targetX = mouseX * 0.001;
        targetY = mouseY * 0.001;
        
        // Fluid Camera Movement
        camera.position.x += 0.05 * (targetX * 20 - camera.position.x);
        camera.position.y += 0.05 * (-targetY * 20 - camera.position.y);
        camera.lookAt(scene.position);

        // Core Interaction (Rotate towards mouse)
        coreMesh.rotation.x += 0.05 * (targetY - coreMesh.rotation.x);
        coreMesh.rotation.y += 0.05 * (targetX - coreMesh.rotation.y);

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
