const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const TILE_SIZE = 1;
const WORLD_WIDTH = 25;
const WORLD_HEIGHT = 19;
const WORLD_DEPTH = 25;

// Generate a basic 3D world with grass and dirt layers
for (let y = 0; y < WORLD_HEIGHT; y++) {
  for (let x = 0; x < WORLD_WIDTH; x++) {
    for (let z = 0; z < WORLD_DEPTH; z++) {
      let color;
      if (y < 10) color = 'skyblue'; // Sky
      else if (y === 10) color = 'green'; // Grass
      else color = 'brown'; // Dirt

      const geometry = new THREE.BoxGeometry(TILE_SIZE, TILE_SIZE, TILE_SIZE);
      const material = new THREE.MeshBasicMaterial({ color });
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(x * TILE_SIZE, y * TILE_SIZE, z * TILE_SIZE);
      scene.add(cube);
    }
  }
}

// Player object
const playerGeometry = new THREE.BoxGeometry(TILE_SIZE, TILE_SIZE, TILE_SIZE);
const playerMaterial = new THREE.MeshBasicMaterial({ color: 'blue' });
const player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.set(5 * TILE_SIZE, 11 * TILE_SIZE, 5 * TILE_SIZE);
scene.add(player);

camera.position.set(12.5 * TILE_SIZE, 20 * TILE_SIZE, 50);
camera.lookAt(12.5 * TILE_SIZE, 10 * TILE_SIZE, 12.5 * TILE_SIZE);

// Handle keyboard input
const keys = {};
window.addEventListener('keydown', (e) => {
  keys[e.key] = true;
});
window.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

// Update player position
function update() {
  // Player movement
  if (keys['ArrowLeft'] || keys['a']) player.position.x -= TILE_SIZE * 0.1;
  if (keys['ArrowRight'] || keys['d']) player.position.x += TILE_SIZE * 0.1;
  if (keys['ArrowUp'] || keys['w']) player.position.z -= TILE_SIZE * 0.1;
  if (keys['ArrowDown'] || keys['s']) player.position.z += TILE_SIZE * 0.1;

  // Prevent player from going out of bounds
  player.position.x = Math.max(0, Math.min(player.position.x, (WORLD_WIDTH - 1) * TILE_SIZE));
  player.position.z = Math.max(0, Math.min(player.position.z, (WORLD_DEPTH - 1) * TILE_SIZE));
  
  // Camera movement (following the player)
  camera.position.x = player.position.x + 15;
  camera.position.z = player.position.z + 15;
  camera.position.y = 30;
  camera.lookAt(player.position);
}

function animate() {
  requestAnimationFrame(animate);
  update();
  renderer.render(scene, camera);
}

animate();
