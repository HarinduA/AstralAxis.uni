import gsap from 'gsap';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { createNoise3D } from 'simplex-noise';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.01, 2000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 1);
document.body.appendChild(renderer.domElement);

// Update renderer size and aspect ratio on window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// Variables
const spaceLength = 1000;
const starDensity = 400;
const starSize = 2;
const cameraPos = new THREE.Vector3(0, 300, 400);

// Camera setup
camera.position.set(0, 0, spaceLength * 1.8);

// Texture Loader
const loader = new THREE.TextureLoader();

// Load textures
const backgroundTexture = loader.load('./image/stars_milky_way.jpg');
const spaceTexture = loader.load('./image/space2.jpg');
const whAlphaMap = loader.load('./image/alpha-map.jpg');
const spAlphaMap = loader.load('./image/alpha-map2.jpg');
const sunTexture = loader.load('./image/sun.jpg');
const mercuryTexture = loader.load('./image/mercury.jpg');
const venusTexture = loader.load('./image/venus.jpg');
const venusAtmosphereTexture = loader.load('./image/venus_atmosphere.jpg');
const venusAtmosphereAlpha = loader.load('./image/venus_atmosphere_alpha_map.jpg');
const earthDayTexture = loader.load('./image/earth_day.jpg');
const earthNightTexture = loader.load('./image/earth_night.jpg');
const earthCloudsTexture = loader.load('./image/4k_earth_clouds.jpg');
const earthCloudsNormal = loader.load('./image/4k_earth_clouds_normal.png');
const earthCloudsSpecular = loader.load('./image/4k_earth_clouds_specular.png');
const earthCloudsAmbient = loader.load('./image/4k_earth_clouds_ao.png');
const marsTexture = loader.load('./image/mars.jpg');
const jupiterTexture = loader.load('./image/jupiter.jpg');
const saturnTexture = loader.load('./image/saturn.jpg');
const saturnRingTexture = loader.load('./image/saturn_ring_alpha_polar.png');
const uranusTexture = loader.load('./image/uranus.jpg');
const uranusRingTexture = loader.load('./image/uranus_ring_alpha_polar.png');
const neptuneTexture = loader.load('./image/neptune.jpg');
const buttonTexture = loader.load('./image/button.png');
const buttonPressedTexture = loader.load('./image/button_press.png');

// Planets group
const planetsGroup = new THREE.Group();
scene.add(planetsGroup);

// Create planets, orbits, and stars
const createPlanet = (geometry, material, orbitGroup, startPos) => {
    const planet = new THREE.Mesh(geometry, material);
    orbitGroup.add(planet);
    orbitGroup.position.copy(startPos);
    planetsGroup.add(orbitGroup);
    return planet;
};

const createOrbitGroup = () => new THREE.Group();

const mercuryOrbit = createOrbitGroup();
const venusOrbit = createOrbitGroup();
const earthOrbit = createOrbitGroup();
const marsOrbit = createOrbitGroup();
const jupiterOrbit = createOrbitGroup();
const saturnOrbit = createOrbitGroup();
const uranusOrbit = createOrbitGroup();
const neptuneOrbit = createOrbitGroup();

const planets = {
    mercury: createPlanet(new THREE.SphereGeometry(2, 32, 16), new THREE.MeshStandardMaterial({ map: mercuryTexture }), mercuryOrbit, new THREE.Vector3(55, 0, 0).multiplyScalar(0.6)),
    venus: createPlanet(new THREE.SphereGeometry(3.8, 32, 36), new THREE.MeshStandardMaterial({ map: venusTexture }), venusOrbit, new THREE.Vector3(-60, 0, 70).multiplyScalar(0.6)),
    earth: createPlanet(new THREE.SphereGeometry(4, 100, 100), new THREE.MeshStandardMaterial({ map: earthDayTexture }), earthOrbit, new THREE.Vector3(100, 0, 100).multiplyScalar(0.6)),
    mars: createPlanet(new THREE.SphereGeometry(3, 40, 32), new THREE.MeshStandardMaterial({ map: marsTexture }), marsOrbit, new THREE.Vector3(130, 0, -150).multiplyScalar(0.6)),
    jupiter: createPlanet(new THREE.SphereGeometry(13, 80, 60), new THREE.MeshStandardMaterial({ map: jupiterTexture }), jupiterOrbit, new THREE.Vector3(-220, 0, -300).multiplyScalar(0.6)),
    saturn: createPlanet(new THREE.SphereGeometry(12, 80, 60), new THREE.MeshStandardMaterial({ map: saturnTexture }), saturnOrbit, new THREE.Vector3(150, 0, -520).multiplyScalar(0.6)),
    uranus: createPlanet(new THREE.SphereGeometry(8, 60, 40), new THREE.MeshStandardMaterial({ map: uranusTexture }), uranusOrbit, new THREE.Vector3(-800, 0, 300).multiplyScalar(0.6)),
    neptune: createPlanet(new THREE.SphereGeometry(8, 60, 40), new THREE.MeshStandardMaterial({ map: neptuneTexture }), neptuneOrbit, new THREE.Vector3(700, 0, 700).multiplyScalar(0.6))
};

// Controls
const controls = new OrbitControls(camera, renderer.domElement);

// Lighting
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
scene.add(ambientLight);

// Animation loop
const clock = new THREE.Clock();
const noise = createNoise3D();

const animate = () => {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Rotate planets
    Object.values(planets).forEach(planet => {
        planet.rotation.y += 0.001;
    });

    // Rotate orbits
    mercuryOrbit.rotation.y += 0.0003;
    venusOrbit.rotation.y += 0.00005;
    earthOrbit.rotation.y += 0.003;
    marsOrbit.rotation.y += 0.003;
    jupiterOrbit.rotation.y += 0.005;
    saturnOrbit.rotation.y += 0.004;
    uranusOrbit.rotation.y += 0.0015;
    neptuneOrbit.rotation.y += 0.0015;

    // Render scene
    renderer.render(scene, camera);
};

animate();

// Button interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const buttonMaterial = new THREE.MeshBasicMaterial({ map: buttonTexture, transparent: true, opacity: 0.7 });
const buttonGeometry = new THREE.RingGeometry(10, 20, 100);
const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
scene.add(button);

window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

window.addEventListener('mousedown', (event) => {
    if (event.button === 0) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length > 0 && intersects[0].object === button) {
            gsap.to(buttonMaterial, { opacity: 1, duration: 0.1 });
        }
    }
});

window.addEventListener('mouseup', (event) => {
    if (event.button === 0) {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children);
        if (intersects.length > 0 && intersects[0].object === button) {
            gsap.to(buttonMaterial, { opacity: 0.7, duration: 0.1 });
        }
    }
});
