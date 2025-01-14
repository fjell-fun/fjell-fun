const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const TILE_SIZE = 1;
const WORLD_WIDTH = 16;
const WORLD_HEIGHT = 16;
const WORLD_DEPTH = 16;

// Add lighting for better visuals
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // Soft light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 10).normalize();
scene.add(directionalLight);

// Generate a 3D world
for (let y = 0; y < WORLD_HEIGHT; y++) {
  for (let x = 0; x < WORLD_WIDTH; x++) {
    for (let z = 0; z < WORLD_DEPTH; z++) {
      let color;
      if (y < 5) color = 'skyblue'; // Sky
      else if (y === 5) color = 'green'; // Grass
      else color = 'brown'; // Dirt

      const geometry = new THREE.BoxGeometry(TILE_SIZE, TILE_SIZE, TILE_SIZE);
      const material = new THREE.MeshStandardMaterial({ color });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(x * TILE_SIZE, y * TILE_SIZE, z * TILE_SIZE);
      scene.add(cube);
    }
  }
}

// Player object
const playerGeometry = new THREE.BoxGeometry(TILE_SIZE, TILE_SIZE, TILE_SIZE);
const playerMaterial = new THREE.MeshStandardMaterial({ color: 'blue' });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.set(8 * TILE_SIZE, 6 * TILE_SIZE, 8 * TILE_SIZE);
scene.add(player);

// Camera setup
camera.position.set(16 * TILE_SIZE, 16 * TILE_SIZE, 30 * TILE_SIZE);
camera.lookAt(WORLD_WIDTH * TILE_SIZE / 2, 5 * TILE_SIZE, WORLD_DEPTH * TILE_SIZE / 2);

// Handle keyboard input
const keys = {};
window.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});
window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

// Movement speed
const PLAYER_SPEED = TILE_SIZE * 0.2;

// Game loop
function update() {
  // Player movement
  if (keys['ArrowLeft'] || keys['a']) player.position.x -= PLAYER_SPEED;
  if (keys['ArrowRight'] || keys['d']) player.position.x += PLAYER_SPEED;
  if (keys['ArrowUp'] || keys['w']) player.position.z -= PLAYER_SPEED;
  if (keys['ArrowDown'] || keys['s']) player.position.z += PLAYER_SPEED;

  // Prevent player from going out of bounds
  player.position.x = Math.max(0, Math.min(player.position.x, (WORLD_WIDTH - 1) * TILE_SIZE));
  player.position.z = Math.max(0, Math.min(player.position.z, (WORLD_DEPTH - 1) * TILE_SIZE));

  // Update camera to follow the player
  camera.position.set(player.position.x, player.position.y + 10, player.position.z + 20);
  camera.lookAt(player.position.x, player.position.y, player.position.z);
}

function animate() {
  requestAnimationFrame(animate);
  update();
  renderer.render(scene, camera);
}

animate();
