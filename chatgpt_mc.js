const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const TILE_SIZE = 1;
const WORLD_WIDTH = 16;
const WORLD_HEIGHT = 10;
const WORLD_DEPTH = 16;

// Add lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(10, 20, 10).normalize();
scene.add(directionalLight);

// Generate the world (simple grid with grass on top and dirt below)
for (let y = 0; y < WORLD_HEIGHT; y++) {
  for (let x = 0; x < WORLD_WIDTH; x++) {
    for (let z = 0; z < WORLD_DEPTH; z++) {
      let color;
      if (y === 0) color = 'green'; // Grass layer
      else if (y < 5) color = 'brown'; // Dirt layers
      else continue; // Empty space above

      const geometry = new THREE.BoxGeometry(TILE_SIZE, TILE_SIZE, TILE_SIZE);
      const material = new THREE.MeshStandardMaterial({ color });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(x * TILE_SIZE, y * TILE_SIZE, z * TILE_SIZE);
      scene.add(cube);
    }
  }
}

// Add the player (blue block)
const playerGeometry = new THREE.BoxGeometry(TILE_SIZE, TILE_SIZE, TILE_SIZE);
const playerMaterial = new THREE.MeshStandardMaterial({ color: 'blue' });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.set(TILE_SIZE * 8, TILE_SIZE, TILE_SIZE * 8);
scene.add(player);

// Set the camera position
camera.position.set(8 * TILE_SIZE, 10 * TILE_SIZE, 20 * TILE_SIZE);
camera.lookAt(player.position);

// Handle keyboard input
const keys = {};
window.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});
window.addEventListener('keyup', (e) => {
  keys[e.key] = false;

// Movement speed
const PLAYER_SPEED = 0.2;

// Add fullscreen toggle
let isFullscreen = false;
function toggleFullscreen() {
  if (!isFullscreen) {
    if (document.body.requestFullscreen) document.body.requestFullscreen();
    isFullscreen = true;
  } else {
    if (document.exitFullscreen) document.exitFullscreen();
    isFullscreen = false;
  }
}

// Event listener for fullscreen toggle
window.addEventListener('keydown', (e) => {
  if (e.key === 'f') toggleFullscreen(); // Press 'F' to toggle fullscreen
});

// Update logic
function update() {
  // Player movement
  if (keys['ArrowLeft'] || keys['a']) player.position.x -= PLAYER_SPEED;
  if (keys['ArrowRight'] || keys['d']) player.position.x += PLAYER_SPEED;
  if (keys['ArrowUp'] || keys['w']) player.position.z -= PLAYER_SPEED;
  if (keys['ArrowDown'] || keys['s']) player.position.z += PLAYER_SPEED;

  // Prevent the player from falling through or going outside the world bounds
  player.position.x = Math.max(0, Math.min(player.position.x, (WORLD_WIDTH - 1) * TILE_SIZE));
  player.position.z = Math.max(0, Math.min(player.position.z, (WORLD_DEPTH - 1) * TILE_SIZE));

  // Update camera to follow the player
  camera.position.set(player.position.x, player.position.y + 10, player.position.z + 20);
  camera.lookAt(player.position);
}

// Render loop
function animate() {
  requestAnimationFrame(animate);
  update();
  renderer.render(scene, camera);
}

// Unlock mouse on 'Escape'
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.exitPointerLock?.();
  }
});

// Lock mouse on click
window.addEventListener('click', () => {
  renderer.domElement.requestPointerLock?.();
});

animate();
