/**
 * arSceneManager.js
 * Módulo responsável por gerenciar a cena AR usando WebXR + Three.js
 */

let arScene, arCamera, arRenderer;
let moleculeGroup;
let isARRunning = false;
let xrSession = null;
let xrRefSpace = null;
let hitTestSource = null;
let isPlaced = false;

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

    // Verificar suporte a WebXR
    if (!navigator.xr) {
      throw new Error("WebXR não é suportado neste navegador. Use Chrome ou Edge em um dispositivo Android/iOS.");
    }

    const isSupported = await navigator.xr.isSessionSupported('immersive-ar');
    if (!isSupported) {
      throw new Error("AR não é suportado neste dispositivo. Certifique-se de estar usando um dispositivo móvel compatível.");
    }

    // Criar cena Three.js
    arScene = new THREE.Scene();

    // Criar câmera
    arCamera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 20);

    // Criar renderer
    arRenderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true 
    });
    arRenderer.setPixelRatio(window.devicePixelRatio);
    arRenderer.setSize(window.innerWidth, window.innerHeight);
    arRenderer.xr.enabled = true;
    
    const container = document.getElementById("container");
    container.appendChild(arRenderer.domElement);

    // Configurar iluminação
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    arScene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(1, 1, 1);
    arScene.add(directionalLight);

    // Parse do PDB e criação da molécula
    const { atoms, connections } = parsePDB(pdbData);

    // Criar grupo para a molécula
    moleculeGroup = new THREE.Group();

    // Renderizar molécula no grupo
    createMoleculeInGroup(atoms, connections, moleculeGroup);

    // Calcular tamanho da molécula para escala apropriada
    const boundingBox = new THREE.Box3().setFromObject(moleculeGroup);
    const size = boundingBox.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    // Escalar molécula para caber bem no AR (ajuste conforme necessário)
    const targetSize = 0.15; // Tamanho em metros no mundo AR
    const scale = targetSize / maxDim;
    moleculeGroup.scale.set(scale, scale, scale);

    // Centralizar molécula
    const center = boundingBox.getCenter(new THREE.Vector3());
    moleculeGroup.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

    // Molécula invisível até ser posicionada
    moleculeGroup.visible = false;
    arScene.add(moleculeGroup);

    // Iniciar sessão AR
    xrSession = await navigator.xr.requestSession('immersive-ar', {
      requiredFeatures: ['hit-test'],
      optionalFeatures: ['dom-overlay'],
      domOverlay: { root: document.getElementById('fileSelector') }
    });

    await xrSession.updateRenderState({
      baseLayer: new XRWebGLLayer(xrSession, arRenderer.getContext())
    });

    xrRefSpace = await xrSession.requestReferenceSpace('local');
    const viewerSpace = await xrSession.requestReferenceSpace('viewer');
    hitTestSource = await xrSession.requestHitTestSource({ space: viewerSpace });

    isARRunning = true;
    isPlaced = false;
    updateARStatus("Toque na tela para posicionar a molécula", "waiting");
    console.log("✅ AR iniciado com sucesso!");

    // Handler de toque para posicionar molécula
    xrSession.addEventListener('select', (event) => {
      if (!isPlaced && hitTestSource) {
        const frame = event.frame;
        const hitTestResults = frame.getHitTestResults(hitTestSource);
        
        if (hitTestResults.length > 0) {
          const hit = hitTestResults[0];
          const pose = hit.getPose(xrRefSpace);
          
          if (pose) {
            moleculeGroup.position.set(
              pose.transform.position.x,
              pose.transform.position.y,
              pose.transform.position.z
            );
            moleculeGroup.visible = true;
            isPlaced = true;
            updateARStatus("Molécula posicionada! Use pinça para redimensionar", "found");
            console.log("✅ Molécula posicionada!");
          }
        }
      }
    });

    // Handler de fim de sessão
    xrSession.addEventListener('end', () => {
      stopARScene();
    });

    // Loop de animação
    arRenderer.setAnimationLoop((timestamp, frame) => {
      if (frame && xrSession) {
        // Rotação suave da molécula
        if (moleculeGroup.visible) {
          moleculeGroup.rotation.y += 0.01;
        }
        
        arRenderer.render(arScene, arCamera);
      }
    });

  } catch (error) {
    console.error("❌ Erro ao inicializar AR:", error);
    updateARStatus("Erro: " + error.message, "lost");
    
    // Mensagem mais amigável
    if (error.message.includes("WebXR")) {
      alert("⚠️ AR não disponível!\n\nPara usar AR:\n1. Use Chrome ou Edge\n2. Use um dispositivo móvel Android/iOS\n3. Permita acesso à câmera\n\nEm computadores, use o visualizador 3D normal.");
    }
    
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
    if (xrSession) {
      xrSession.end();
      xrSession = null;
    }

    if (hitTestSource) {
      hitTestSource.cancel();
      hitTestSource = null;
    }

    arRenderer.setAnimationLoop(null);
    isARRunning = false;
    isPlaced = false;
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

