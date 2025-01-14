// Create scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const TILE_SIZE = 1;
const WORLD_WIDTH = 25;
const WORLD_HEIGHT = 19;
const WORLD_DEPTH = 25;
let gravity = -0.1;
let velocity = new THREE.Vector3(0, 0, 0);

// Textures for blocks
const loader = new THREE.TextureLoader();
const grassTexture = loader.load('https://example.com/grass.png');  // Replace with actual texture URL
const dirtTexture = loader.load('https://example.com/dirt.png');    // Replace with actual texture URL
const skyTexture = loader.load('https://example.com/sky.png');      // Replace with actual texture URL

// Generate the world with textures
for (let y = 0; y < WORLD_HEIGHT; y++) {
  for (let x = 0; x < WORLD_WIDTH; x++) {
    for (let z = 0; z < WORLD_DEPTH; z++) {
      let texture;
      if (y < 10) texture = skyTexture;  // Sky
      else if (y === 10) texture = grassTexture; // Grass
      else texture = dirtTexture;  // Dirt

      const geometry = new THREE.BoxGeometry(TILE_SIZE, TILE_SIZE, TILE_SIZE);
      const material = new THREE.MeshBasicMaterial({ map: texture });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(x * TILE_SIZE, y * TILE_SIZE, z * TILE_SIZE);
      scene.add(cube);
    }
  }
}

// Player object with physics
const playerGeometry = new THREE.BoxGeometry(TILE_SIZE, TILE_SIZE, TILE_SIZE);
const playerMaterial = new THREE.MeshBasicMaterial({ color: 'blue' });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.set(5 * TILE_SIZE, 11 * TILE_SIZE, 5 * TILE_SIZE);
scene.add(player);

// Camera setup and controls
camera.position.set(12.5 * TILE_SIZE, 20 * TILE_SIZE, 50);
camera.lookAt(12.5 * TILE_SIZE, 10 * TILE_SIZE, 12.5 * TILE_SIZE);

// Mouse control (OrbitControls.js is required)
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;  // Smooth camera movement
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false;
controls.maxPolarAngle = Math.PI / 2;  // Limit to horizontal camera rotation

// Keyboard input for movement
const keys = {};
window.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});
window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

// Update player and physics
function update() {
  // Handle player movement
  if (keys['ArrowLeft'] || keys['a']) player.position.x -= TILE_SIZE * 0.1;
  if (keys['ArrowRight'] || keys['d']) player.position.x += TILE_SIZE * 0.1;
  if (keys['ArrowUp'] || keys['w']) player.position.z -= TILE_SIZE * 0.1;
  if (keys['ArrowDown'] || keys['s']) player.position.z += TILE_SIZE * 0.1;

  // Gravity and jumping (spacebar to jump)
  if (player.position.y > 10 * TILE_SIZE) {
    velocity.y += gravity; // Apply gravity
  } else if (keys[' '] && player.position.y <= 10 * TILE_SIZE) {
    velocity.y = 2; // Jump when spacebar is pressed
  }

  // Update player position based on velocity
  player.position.y += velocity.y;

  // Prevent player from going out of bounds horizontally
  player.position.x = Math.max(0, Math.min(player.position.x, (WORLD_WIDTH - 1) * TILE_SIZE));
  player.position.z = Math.max(0, Math.min(player.position.z, (WORLD_DEPTH - 1) * TILE_SIZE));

  // Apply physics to make sure the player stays grounded
  if (player.position.y < 10 * TILE_SIZE) {
    player.position.y = 10 * TILE_SIZE;
    velocity.y = 0;
  }
}

// Game loop
function animate() {
  requestAnimationFrame(animate);
  update();
  controls.update();  // Update controls for smooth camera movement
  renderer.render(scene, camera);
}

animate();
