/**
 * arSceneManager.js
 * Módulo responsável por gerenciar a cena AR usando MindAR + Three.js
 */

let mindarThree;
let arScene, arCamera, arRenderer;
let moleculeAnchor;
let isARRunning = false;

/**
 * Inicializa a cena AR e carrega a molécula
 * @param {string} pdbData - Dados do arquivo PDB
 * @param {string} moleculeName - Nome da molécula
 */
async function initARScene(pdbData, moleculeName) {
  if (isARRunning) {
    console.warn("AR já está em execução");
    return;
  }

  try {
    updateARStatus("Iniciando AR...", "waiting");

    // Criar instância do MindAR
    // Nota: MindAR Image requer um arquivo .mind com targets de imagem
    // Para simplificar, vamos usar o modo sem marcadores (image-tracking)
    mindarThree = new window.MINDAR.IMAGE.MindARThree({
      container: document.getElementById("container"),
      imageTargetSrc: "./targets.mind", // Você precisará criar este arquivo
      maxTrack: 1, // Número máximo de marcadores a rastrear simultaneamente
      filterMinCF: 0.0001,
      filterBeta: 0.001,
      warmupTolerance: 5,
      missTolerance: 5,
    });

    const { renderer, scene, camera } = mindarThree;
    arRenderer = renderer;
    arScene = scene;
    arCamera = camera;

    // Configurar iluminação
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    arScene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(1, 1, 1);
    arScene.add(directionalLight);

    // Criar âncora para a molécula (vinculada ao marcador 0)
    moleculeAnchor = mindarThree.addAnchor(0);

    // Parse do PDB e criação da molécula
    const { atoms, connections } = parsePDB(pdbData);

    // Criar grupo para a molécula
    const moleculeGroup = new THREE.Group();

    // Renderizar molécula no grupo
    createMoleculeInGroup(atoms, connections, moleculeGroup);

    // Calcular tamanho da molécula para escala apropriada
    const boundingBox = new THREE.Box3().setFromObject(moleculeGroup);
    const size = boundingBox.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    // Escalar molécula para caber bem no AR (ajuste conforme necessário)
    const targetSize = 0.5; // Tamanho em metros no mundo AR
    const scale = targetSize / maxDim;
    moleculeGroup.scale.set(scale, scale, scale);

    // Centralizar molécula
    const center = boundingBox.getCenter(new THREE.Vector3());
    moleculeGroup.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

    // Adicionar rotação automática suave
    moleculeGroup.userData.rotationSpeed = 0.3;

    // Adicionar molécula à âncora
    moleculeAnchor.group.add(moleculeGroup);

    // Eventos de rastreamento
    moleculeAnchor.onTargetFound = () => {
      console.log("🎯 Marcador detectado!");
      updateARStatus("Marcador detectado!", "found");
    };

    moleculeAnchor.onTargetLost = () => {
      console.log("❌ Marcador perdido");
      updateARStatus("Procurando marcador...", "lost");
    };

    // Iniciar AR
    await mindarThree.start();
    isARRunning = true;

    updateARStatus("AR Ativo - Procurando marcador...", "waiting");
    console.log("✅ AR iniciado com sucesso!");

    // Loop de animação
    arRenderer.setAnimationLoop(() => {
      if (moleculeGroup && moleculeAnchor.group.visible) {
        // Rotação suave da molécula
        moleculeGroup.rotation.y += 0.01 * moleculeGroup.userData.rotationSpeed;
      }
      arRenderer.render(arScene, arCamera);
    });

  } catch (error) {
    console.error("❌ Erro ao inicializar AR:", error);
    updateARStatus("Erro ao iniciar AR", "lost");
    throw error;
  }
}

/**
 * Para a sessão AR
 */
function stopARScene() {
  if (!isARRunning) {
    console.warn("AR não está em execução");
    return;
  }

  try {
    if (mindarThree) {
      mindarThree.stop();
      arRenderer.setAnimationLoop(null);
    }

    isARRunning = false;
    updateARStatus("AR Parado", "lost");

    // Limpar container
    const container = document.getElementById("container");
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    console.log("✅ AR parado com sucesso");
  } catch (error) {
    console.error("❌ Erro ao parar AR:", error);
  }
}

/**
 * Cria uma molécula dentro de um grupo específico
 * @param {Array} atoms - Array de átomos
 * @param {Array} connections - Array de conexões
 * @param {THREE.Group} group - Grupo onde adicionar a molécula
 */
function createMoleculeInGroup(atoms, connections, group) {
  // Criar esferas para átomos
  atoms.forEach((atom) => {
    const radius = getAtomRadius(atom.element);
    const geometry = new THREE.SphereGeometry(radius, 16, 16);
    const color = getAtomColor(atom.element);
    const material = new THREE.MeshPhongMaterial({
      color: color,
      shininess: 30,
      specular: 0x333333
    });

    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(atom.x, atom.y, atom.z);
    sphere.userData.atom = atom;

    group.add(sphere);
  });

  // Criar cilindros para ligações
  connections.forEach((conn) => {
    const atom1 = atoms.find((a) => a.id === conn.atom1);
    const atom2 = atoms.find((a) => a.id === conn.atom2);

    if (atom1 && atom2) {
      const start = new THREE.Vector3(atom1.x, atom1.y, atom1.z);
      const end = new THREE.Vector3(atom2.x, atom2.y, atom2.z);
      const distance = start.distanceTo(end);

      createBondInGroup(atom1, atom2, group, distance);
    }
  });
}

/**
 * Cria uma ligação entre dois átomos em um grupo
 * @param {Object} atom1 - Primeiro átomo
 * @param {Object} atom2 - Segundo átomo
 * @param {THREE.Group} group - Grupo para adicionar a ligação
 * @param {number} length - Comprimento da ligação
 */
function createBondInGroup(atom1, atom2, group, length) {
  const start = new THREE.Vector3(atom1.x, atom1.y, atom1.z);
  const end = new THREE.Vector3(atom2.x, atom2.y, atom2.z);
  const direction = new THREE.Vector3().subVectors(end, start);
  const midpoint = new THREE.Vector3()
    .addVectors(start, end)
    .multiplyScalar(0.5);

  const geometry = new THREE.CylinderGeometry(0.15, 0.15, length, 8);
  const material = new THREE.MeshPhongMaterial({
    color: 0xcccccc,
    shininess: 20
  });
  const cylinder = new THREE.Mesh(geometry, material);

  cylinder.position.copy(midpoint);
  cylinder.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction.clone().normalize()
  );

  group.add(cylinder);
}

/**
 * Atualiza o status da AR na interface
 * @param {string} text - Texto do status
 * @param {string} state - Estado: "waiting", "found", "lost"
 */
function updateARStatus(text, state) {
  const statusText = document.getElementById("statusText");
  const indicator = document.querySelector(".status-indicator");

  if (statusText) {
    statusText.textContent = text;
  }

  if (indicator) {
    indicator.className = `status-indicator status-${state}`;
  }
}

/**
 * Obtém o raio de um átomo para renderização
 * @param {string} element - Símbolo do elemento
 * @returns {number} - Raio do átomo
 */
function getAtomRadius(element) {
  const RADII = {
    H: 0.5,
    C: 0.7,
    N: 0.65,
    O: 0.6,
    F: 0.5,
    P: 0.9,
    S: 0.88,
    Cl: 0.85,
    Br: 1.0,
    I: 1.2,
    Na: 1.0,
    K: 1.2,
    Ca: 1.0,
    Mg: 0.9,
    Fe: 0.8,
    Zn: 0.75,
    Cu: 0.75,
  };
  return RADII[element] || 0.7;
}

