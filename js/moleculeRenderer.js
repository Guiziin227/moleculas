/**
 * moleculeRenderer.js
 * Módulo responsável por renderizar moléculas em 3D usando Three.js
 */

/**
 * Cores CPK (Corey-Pauling-Koltun) para elementos químicos
 */
const CPK_COLORS = {
  H: 0xffffff, // Hidrogênio - branco
  C: 0x000000, // Carbono - preto
  N: 0x3050f8, // Nitrogênio - azul
  O: 0xff0d0d, // Oxigênio - vermelho
  F: 0x90e050, // Flúor - verde claro
  Cl: 0x1ff01f, // Cloro - verde
  Br: 0xa62929, // Bromo - marrom escuro
  I: 0x940094, // Iodo - roxo escuro
  He: 0xd9ffff, // Hélio - ciano claro
  Ne: 0xb3e3f5, // Neônio - azul claro
  Ar: 0x80d1e3, // Argônio - azul acinzentado
  Xe: 0x429eb0, // Xenônio - azul esverdeado
  Kr: 0x5cb8b8, // Criptônio - azul esverdeado
  P: 0xff8000, // Fósforo - laranja
  S: 0xffff30, // Enxofre - amarelo
  B: 0xffb5b5, // Boro - rosa
  Li: 0xcc80ff, // Lítio - violeta
  Na: 0xab5cf2, // Sódio - violeta
  K: 0x8f40d4, // Potássio - violeta
  Rb: 0x702eb0, // Rubídio - violeta escuro
  Cs: 0x57178f, // Césio - violeta escuro
  Be: 0xc2ff00, // Berílio - verde amarelado
  Mg: 0x8aff00, // Magnésio - verde
  Ca: 0x3dff00, // Cálcio - verde escuro
  Ti: 0xbfc2c7, // Titânio - cinza
  Fe: 0xe06633, // Ferro - laranja
  Zn: 0x7d80b0, // Zinco - azul acinzentado
  Cu: 0xc88033, // Cobre - laranja avermelhado
  Ni: 0x50d050, // Níquel - verde
  Co: 0xf090a0, // Cobalto - rosa avermelhado
  Mn: 0x9c7ac7, // Manganês - roxo
  Al: 0xbfa6a6, // Alumínio - cinza claro
  Si: 0xf0c8a0, // Silício - bege
  Se: 0xffa100, // Selênio - laranja escuro
  Y: 0x94ffff, // Ítrio - ciano
  Ba: 0x00c900, // Bário - verde escuro
};

/**
 * Obtém a cor CPK de um elemento
 * @param {string} element - Símbolo do elemento químico
 * @returns {number} - Cor hexadecimal
 */
function getAtomColor(element) {
  return CPK_COLORS[element] || 0x909090; // Cinza padrão para elementos não definidos
}

/**
 * Cria uma ligação (bond) entre dois átomos
 * @param {Object} atom1 - Primeiro átomo
 * @param {Object} atom2 - Segundo átomo
 * @param {THREE.Group} group - Grupo para adicionar a ligação
 * @param {number} length - Comprimento da ligação
 */
function createBond(atom1, atom2, group, length) {
  const start = new THREE.Vector3(atom1.x, atom1.y, atom1.z);
  const end = new THREE.Vector3(atom2.x, atom2.y, atom2.z);
  const direction = new THREE.Vector3().subVectors(end, start);
  const midpoint = new THREE.Vector3()
    .addVectors(start, end)
    .multiplyScalar(0.5);

  const geometry = new THREE.CylinderGeometry(0.15, 0.15, length, 8);
  const material = new THREE.MeshBasicMaterial({ color: 0xcccccc });
  const cylinder = new THREE.Mesh(geometry, material);

  cylinder.position.copy(midpoint);
  cylinder.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction.clone().normalize()
  );

  group.add(cylinder);
}

/**
 * Raios covalentes dos elementos (em Angstroms)
 */
const COVALENT_RADII = {
  H: 0.31,
  C: 0.76,
  N: 0.71,
  O: 0.66,
  F: 0.57,
  P: 1.07,
  S: 1.05,
  Cl: 1.02,
  Br: 1.2,
  I: 1.39,
  B: 0.84,
  Si: 1.11,
  Li: 1.28,
  Na: 1.66,
  K: 2.03,
  Mg: 1.41,
  Ca: 1.76,
  Fe: 1.32,
  Zn: 1.22,
  Cu: 1.32,
  Ti: 1.6,
  Al: 1.21,
  Ba: 2.15,
  Y: 1.9,
};

/**
 * Cria ligações automaticamente baseadas na distância entre átomos
 * @param {Array} atoms - Array de átomos
 * @param {THREE.Group} group - Grupo para adicionar as ligações
 */
function createBondsFromDistance(atoms, group) {
  const processedPairs = new Set();

  for (let i = 0; i < atoms.length; i++) {
    const atom1 = atoms[i];
    const radius1 = COVALENT_RADII[atom1.element] || 1.0;

    for (let j = i + 1; j < atoms.length; j++) {
      const atom2 = atoms[j];
      const radius2 = COVALENT_RADII[atom2.element] || 1.0;

      // Calcular distância entre os átomos
      const distance = Math.sqrt(
        Math.pow(atom1.x - atom2.x, 2) +
          Math.pow(atom1.y - atom2.y, 2) +
          Math.pow(atom1.z - atom2.z, 2)
      );

      // Distância máxima de ligação: soma dos raios covalentes + tolerância (15%)
      const maxBondDistance = (radius1 + radius2) * 1.15;

      // Se a distância for menor que a soma dos raios covalentes, criar ligação
      if (distance > 0.4 && distance <= maxBondDistance) {
        const pairId = [
          Math.min(atom1.id, atom2.id),
          Math.max(atom1.id, atom2.id),
        ].join("-");

        if (!processedPairs.has(pairId)) {
          processedPairs.add(pairId);
          createBond(atom1, atom2, group, distance);
        }
      }
    }
  }
}

/**
 * Cria ligações a partir das informações CONECT do PDB
 * @param {Map} atomMap - Mapa de átomos por ID
 * @param {Map} connections - Mapa de conexões
 * @param {THREE.Group} group - Grupo para adicionar as ligações
 */
function createBondsFromConect(atomMap, connections, group) {
  const processedPairs = new Set();

  connections.forEach((connectedAtoms, atomId) => {
    const atom1 = atomMap.get(atomId);
    if (!atom1) return;

    connectedAtoms.forEach((connectedId) => {
      const atom2 = atomMap.get(connectedId);
      if (!atom2) return;

      // Evita duplicatas usando um ID único para o par
      const pairId = [
        Math.min(atomId, connectedId),
        Math.max(atomId, connectedId),
      ].join("-");
      if (processedPairs.has(pairId)) return;
      processedPairs.add(pairId);

      const distance = Math.sqrt(
        Math.pow(atom1.x - atom2.x, 2) +
          Math.pow(atom1.y - atom2.y, 2) +
          Math.pow(atom1.z - atom2.z, 2)
      );

      createBond(atom1, atom2, group, distance);
    });
  });
}

/**
 * Calcula o centro geométrico (centróide) de uma molécula
 * @param {Array} atoms - Array de átomos
 * @returns {Object} - Objeto com coordenadas x, y, z do centro
 */
function calculateMoleculeCenter(atoms) {
  if (atoms.length === 0) return { x: 0, y: 0, z: 0 };

  let sumX = 0,
    sumY = 0,
    sumZ = 0;

  atoms.forEach((atom) => {
    sumX += atom.x;
    sumY += atom.y;
    sumZ += atom.z;
  });

  return {
    x: sumX / atoms.length,
    y: sumY / atoms.length,
    z: sumZ / atoms.length,
  };
}

/**
 * Calcula o tamanho (bounding box) da molécula
 * @param {Array} atoms - Array de átomos
 * @returns {number} - Maior dimensão da molécula
 */
function calculateMoleculeSize(atoms) {
  if (atoms.length === 0) return 10;

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

  return Math.max(sizeX, sizeY, sizeZ);
}

/**
 * Cria a representação 3D de uma molécula
 * @param {Array} atoms - Array de átomos
 * @param {Map} connections - Mapa de conexões
 * @param {THREE.Scene} scene - Cena Three.js onde adicionar a molécula
 * @returns {THREE.Group} - Grupo contendo a molécula
 */
function createMolecule(atoms, connections, scene) {
  const group = new THREE.Group();
  const atomMap = new Map();

  // Calcular centro da molécula
  const center = calculateMoleculeCenter(atoms);

  // Criar esferas para os átomos
  atoms.forEach((atom) => {
    const geometry = new THREE.SphereGeometry(0.5);
    const material = new THREE.MeshBasicMaterial({
      color: getAtomColor(atom.element),
    });

    const sphere = new THREE.Mesh(geometry, material);
    // Centralizar átomo subtraindo o centro da molécula
    sphere.position.set(
      atom.x - center.x,
      atom.y - center.y,
      atom.z - center.z
    );
    sphere.userData.atom = atom; // Armazenar dados do átomo no objeto
    group.add(sphere);
    atomMap.set(atom.id, atom);
  });

  // Ajustar posições dos átomos no atomMap para as ligações
  atoms.forEach((atom) => {
    atom.x -= center.x;
    atom.y -= center.y;
    atom.z -= center.z;
  });

  // Criar ligações
  if (connections.size > 0) {
    // Se houver informações CONECT, usar elas
    createBondsFromConect(atomMap, connections, group);
  } else {
    // Caso contrário, criar ligações automaticamente baseadas na distância
    console.log(
      "⚠️ Nenhuma informação CONECT encontrada. Criando ligações automaticamente..."
    );
    createBondsFromDistance(atoms, group);
  }

  // Centralizar o grupo na origem (0, 0, 0)
  group.position.set(0, 0, 0);

  scene.add(group);
  return group;
}

// Exportar funções
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    createMolecule,
    getAtomColor,
    createBond,
    createBondsFromConect,
    createBondsFromDistance,
    calculateMoleculeCenter,
    calculateMoleculeSize,
  };
}
