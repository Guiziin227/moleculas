/**
 * sceneManager.js
 * Módulo responsável por gerenciar a cena Three.js
 */

let scene, camera, renderer, controls;
let raycaster, mouse;
let infoDiv;

/**
 * Nomes dos elementos em português
 */
const ELEMENT_NAMES = {
  H: "Hidrogênio",
  C: "Carbono",
  N: "Nitrogênio",
  O: "Oxigênio",
  F: "Flúor",
  Cl: "Cloro",
  Br: "Bromo",
  I: "Iodo",
  P: "Fósforo",
  S: "Enxofre",
  B: "Boro",
  Li: "Lítio",
  Na: "Sódio",
  K: "Potássio",
  Fe: "Ferro",
  Zn: "Zinco",
  Ti: "Titânio",
  Mg: "Magnésio",
  Ca: "Cálcio",
  Al: "Alumínio",
  Cu: "Cobre",
  Y: "Ítrio",
  Ba: "Bário",
  Si: "Silício",
};

/**
 * Inicializa a cena Three.js
 */
function initScene() {
  // Scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  // Camera
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 50);

  // Renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("container").appendChild(renderer.domElement);

  // Controls
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // Adiciona suavidade na rotação
  controls.dampingFactor = 0.05;
  controls.target.set(0, 0, 0); // Sempre olhar para o centro
  controls.minDistance = 5; // Distância mínima de zoom
  controls.maxDistance = 200; // Distância máxima de zoom

  // Raycaster para detecção de cliques
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();

  // Criar div para informações
  createInfoDiv();

  // Event listener para cliques
  renderer.domElement.addEventListener("click", onMouseClick, false);

  // Event listener para redimensionamento
  window.addEventListener("resize", onWindowResize);

  // Iniciar animação
  animate();
}

/**
 * Ajusta a câmera para enquadrar a molécula perfeitamente
 * @param {Array} atoms - Array de átomos da molécula
 */
function adjustCameraToMolecule(atoms) {
  if (!atoms || atoms.length === 0) return;

  // Calcular o tamanho da molécula
  let minX = Infinity,
    maxX = -Infinity;
  let minY = Infinity,
    maxY = -Infinity;
  let minZ = Infinity,
    maxZ = -Infinity;

  atoms.forEach((atom) => {
    minX = Math.min(minX, atom.x);
    maxX = Math.max(maxX, atom.x);
    minY = Math.min(minY, atom.y);
    maxY = Math.max(maxY, atom.y);
    minZ = Math.min(minZ, atom.z);
    maxZ = Math.max(maxZ, atom.z);
  });

  const sizeX = maxX - minX;
  const sizeY = maxY - minY;
  const sizeZ = maxZ - minZ;
  const maxSize = Math.max(sizeX, sizeY, sizeZ);

  // Calcular distância ideal da câmera
  const fov = camera.fov * (Math.PI / 180);
  const distance = Math.abs(maxSize / Math.sin(fov / 2)) * 1.5; // 1.5 = margem

  // Posicionar câmera
  camera.position.set(0, 0, distance);
  camera.lookAt(0, 0, 0);

  // Atualizar controles
  controls.target.set(0, 0, 0);
  controls.update();

  console.log(
    `📐 Molécula: ${maxSize.toFixed(2)}Å | Câmera: ${distance.toFixed(
      2
    )} unidades`
  );
}

/**
 * Cria a div de informações do átomo
 */
function createInfoDiv() {
  infoDiv = document.createElement("div");
  infoDiv.style.position = "absolute";
  infoDiv.style.top = "10px";
  infoDiv.style.left = "10px";
  infoDiv.style.color = "white";
  infoDiv.style.fontFamily = "Arial, sans-serif";
  infoDiv.style.fontSize = "16px";
  infoDiv.style.background = "rgba(0, 0, 0, 0.7)";
  infoDiv.style.padding = "10px";
  infoDiv.style.borderRadius = "5px";
  infoDiv.style.display = "none";
  infoDiv.innerHTML = "Clique em um átomo para ver informações";
  document.body.appendChild(infoDiv);
}

/**
 * Manipula cliques na cena
 */
function onMouseClick(event) {
  // Calcular posição do mouse em coordenadas normalizadas (-1 a +1)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  // Atualizar o raycaster
  raycaster.setFromCamera(mouse, camera);

  // Encontrar intersecções com objetos na cena
  const intersects = raycaster.intersectObjects(scene.children, true);

  if (intersects.length > 0) {
    const clickedObject = intersects[0].object;

    // Verificar se é uma esfera (átomo)
    if (
      clickedObject.geometry instanceof THREE.SphereGeometry &&
      clickedObject.userData.atom
    ) {
      showAtomInfo(clickedObject.userData.atom, event.clientX, event.clientY);
    }
  }
}

/**
 * Mostra informações do átomo clicado
 */
function showAtomInfo(atom, x, y) {
  const elementName = ELEMENT_NAMES[atom.element] || atom.element;
  const atomType = atom.isHetatm ? "HETATM" : "ATOM";

  infoDiv.innerHTML = `
    <strong>Átomo #${atom.id}</strong><br>
    Elemento: <strong>${atom.element}</strong> (${elementName})<br>
    Posição: (${atom.x.toFixed(2)}, ${atom.y.toFixed(2)}, ${atom.z.toFixed(2)})
  `;

  // Posicionar a div próxima ao cursor
  infoDiv.style.left = x + 10 + "px";
  infoDiv.style.top = y + 10 + "px";
  infoDiv.style.display = "block";

  // Esconder após 3 segundos
  setTimeout(() => {
    infoDiv.style.display = "none";
  }, 3000);
}

/**
 * Loop de animação
 */
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}

/**
 * Manipula redimensionamento da janela
 */
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

/**
 * Limpa todos os objetos da cena
 */
function clearScene() {
  while (scene.children.length > 0) {
    const child = scene.children[0];
    scene.remove(child);
    // Limpar geometrias e materiais
    if (child.geometry) child.geometry.dispose();
    if (child.material) child.material.dispose();
  }
  if (document.getElementById("moleName")) {
    document.getElementById("moleName").innerText =
      "Nenhuma molécula carregada";
  }
}

/**
 * Retorna a cena atual
 */
function getScene() {
  return scene;
}

/**
 * Retorna a câmera atual
 */
function getCamera() {
  return camera;
}

/**
 * Retorna os controles atuais
 */
function getControls() {
  return controls;
}

// Exportar funções e variáveis
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    initScene,
    clearScene,
    getScene,
    getCamera,
    getControls,
    adjustCameraToMolecule,
    animate,
  };
}
