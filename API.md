# Documentação da API

Este documento descreve todas as funções públicas e privadas de cada módulo do projeto.

---

## 📦 pdbParser.js

### Funções Públicas

#### `parsePDB(data)`

Faz o parsing completo de um arquivo PDB.

**Parâmetros:**
- `data` (string): Conteúdo completo do arquivo PDB

**Retorno:**
```javascript
{
  atoms: Array<Atom>,
  connections: Array<Connection>
}
```

**Tipos:**
```javascript
type Atom = {
  serial: number,      // Número serial do átomo
  name: string,        // Nome do átomo (ex: "CA", "N", "O")
  element: string,     // Símbolo químico (ex: "C", "N", "O")
  x: number,          // Coordenada X em Angstroms
  y: number,          // Coordenada Y em Angstroms
  z: number           // Coordenada Z em Angstroms
}

type Connection = {
  from: number,        // Serial do átomo de origem
  to: Array<number>    // Array de serials conectados
}
```

**Exemplo:**
```javascript
const pdbData = `
ATOM      1  N   MET A   1      10.5  20.3  -5.8  1.00  0.00           N
ATOM      2  CA  MET A   1      11.2  21.5  -6.3  1.00  0.00           C
CONECT    1    2
`;

const result = parsePDB(pdbData);
console.log(result);
// {
//   atoms: [
//     { serial: 1, name: "N", element: "N", x: 10.5, y: 20.3, z: -5.8 },
//     { serial: 2, name: "CA", element: "C", x: 11.2, y: 21.5, z: -6.3 }
//   ],
//   connections: [
//     { from: 1, to: [2] }
//   ]
// }
```

**Comportamento:**
- Processa linhas ATOM e HETATM
- Ignora outras linhas (HEADER, REMARK, etc.)
- Extrai coordenadas das colunas fixas do formato PDB
- Processa registros CONECT para ligações explícitas
- Retorna arrays vazios se não houver dados

---

#### `extractElement(line)`

Extrai o símbolo do elemento químico de uma linha ATOM/HETATM.

**Parâmetros:**
- `line` (string): Linha do arquivo PDB (formato ATOM/HETATM)

**Retorno:**
- `string`: Símbolo do elemento (ex: "C", "N", "O", "CA", "FE")

**Algoritmo:**

1. **Tenta colunas 77-78** (formato PDB padrão):
   ```
   ATOM      1  N   MET A   1      10.5  20.3  -5.8  1.00  0.00           N
                                                                          ^^
   ```

2. **Se não encontrar, usa colunas 13-16** (nome do átomo):
   ```
   ATOM      1  N   MET A   1      10.5  20.3  -5.8  1.00  0.00           N
                ^^^^
   ```

3. **Valida elementos de 2 letras**:
   - Se primeira letra for número, remove (ex: "1CA" → "CA")
   - Verifica se está em `TWO_LETTER_ELEMENTS`
   - Caso contrário, pega apenas primeira letra

**Exemplo:**
```javascript
const line = "ATOM      1  CA  MET A   1      10.5  20.3  -5.8  1.00  0.00           C";
const element = extractElement(line);
console.log(element); // "C"

const line2 = "ATOM     20  FE  HEM A   1      15.2  18.7  -2.3  1.00  0.00          FE";
const element2 = extractElement(line2);
console.log(element2); // "FE"
```

---

### Constantes

#### `TWO_LETTER_ELEMENTS`

Array com símbolos de elementos químicos que possuem 2 letras.

**Tipo:** `Array<string>`

**Conteúdo:** `["HE", "LI", "BE", "NE", "NA", "MG", "AL", "SI", "CL", ...]`

**Uso:** Validação ao extrair elementos de nomes de átomos

---

## 📦 moleculeRenderer.js

### Funções Públicas

#### `createMolecule(atoms, connections, scene)`

Cria a representação 3D completa de uma molécula.

**Parâmetros:**
- `atoms` (Array<Atom>): Array de átomos retornado por `parsePDB()`
- `connections` (Array<Connection>): Array de conexões retornado por `parsePDB()`
- `scene` (THREE.Scene): Cena Three.js onde adicionar a molécula

**Retorno:**
- `THREE.Group`: Grupo contendo todos os objetos 3D da molécula

**Exemplo:**
```javascript
const { atoms, connections } = parsePDB(pdbData);
const scene = getScene();
const molecule = createMolecule(atoms, connections, scene);

// Acessar bounding box
const bbox = new THREE.Box3().setFromObject(molecule);
console.log(bbox.getSize()); // Tamanho da molécula
```

**Comportamento:**
1. Cria um `THREE.Group` para agrupar átomos e ligações
2. Para cada átomo:
   - Cria esfera com cor CPK
   - Adiciona ao grupo
   - Armazena referência com userData
3. Cria ligações:
   - Se `connections` disponível: usa `createBondsFromConect()`
   - Senão: usa `createBondsFromDistance()` (cálculo automático)
4. Adiciona grupo à cena
5. Retorna o grupo

---

#### `getAtomColor(element)`

Retorna a cor CPK (Corey-Pauling-Koltun) de um elemento.

**Parâmetros:**
- `element` (string): Símbolo do elemento químico (ex: "C", "N", "O")

**Retorno:**
- `number`: Cor em hexadecimal (ex: 0xff0d0d para vermelho)

**Exemplo:**
```javascript
console.log(getAtomColor("C"));  // 0x000000 (preto)
console.log(getAtomColor("O"));  // 0xff0d0d (vermelho)
console.log(getAtomColor("N"));  // 0x3050f8 (azul)
console.log(getAtomColor("XYZ")); // 0x909090 (cinza padrão)
```

**Cores CPK Principais:**

| Elemento | Cor | Hex | Descrição |
|----------|-----|-----|-----------|
| H | Branco | 0xffffff | Hidrogênio |
| C | Preto | 0x000000 | Carbono |
| N | Azul | 0x3050f8 | Nitrogênio |
| O | Vermelho | 0xff0d0d | Oxigênio |
| S | Amarelo | 0xffff30 | Enxofre |
| P | Laranja | 0xff8000 | Fósforo |
| Cl | Verde | 0x1ff01f | Cloro |
| Fe | Laranja | 0xe06633 | Ferro |
| Na | Violeta | 0xab5cf2 | Sódio |
| Ca | Verde escuro | 0x3dff00 | Cálcio |

---

#### `createBond(atom1, atom2, group, length)`

Cria uma ligação (cilindro) entre dois átomos.

**Parâmetros:**
- `atom1` (Atom): Primeiro átomo
- `atom2` (Atom): Segundo átomo
- `group` (THREE.Group): Grupo onde adicionar a ligação
- `length` (number): Comprimento da ligação em Angstroms

**Retorno:**
- `void` (adiciona cilindro ao grupo)

**Detalhes de implementação:**
```javascript
// Geometria
const geometry = new THREE.CylinderGeometry(
  0.15,    // raio superior
  0.15,    // raio inferior
  length,  // altura
  8        // segmentos radiais
);

// Material
const material = new THREE.MeshBasicMaterial({ 
  color: 0xcccccc  // cinza claro
});

// Posicionamento
cylinder.position.copy(midpoint); // ponto médio entre átomos

// Orientação (usando quaternions)
cylinder.quaternion.setFromUnitVectors(
  new THREE.Vector3(0, 1, 0),  // vetor "up" padrão do cilindro
  direction.normalize()         // direção da ligação
);
```

**Exemplo:**
```javascript
const atom1 = { x: 0, y: 0, z: 0, element: "C" };
const atom2 = { x: 1.5, y: 0, z: 0, element: "C" };
const group = new THREE.Group();
const length = 1.5;

createBond(atom1, atom2, group, length);
// Cilindro adicionado ao grupo
```

---

### Funções Internas

#### `createBondsFromConect(atomMap, connections, group)`

Cria ligações usando dados CONECT explícitos do arquivo PDB.

**Parâmetros:**
- `atomMap` (Map<number, Atom>): Mapa de serial → átomo
- `connections` (Array<Connection>): Conexões do arquivo PDB
- `group` (THREE.Group): Grupo para adicionar ligações

**Retorno:**
- `void`

**Comportamento:**
- Para cada conexão, cria cilindro entre átomos
- Calcula distância automaticamente
- Ignora conexões com átomos inexistentes

---

#### `createBondsFromDistance(atoms, group)`

Cria ligações automaticamente baseado em distância entre átomos.

**Parâmetros:**
- `atoms` (Array<Atom>): Array de átomos
- `group` (THREE.Group): Grupo para adicionar ligações

**Retorno:**
- `void`

**Algoritmo:**
```javascript
Para cada par de átomos (i, j) onde i < j:
  distancia = calcular_distancia(atom_i, atom_j)
  raio_max = (raio_covalente_i + raio_covalente_j) * 1.3
  
  Se distancia < raio_max:
    criar_ligacao(atom_i, atom_j)
```

**Critérios:**
- Distância máxima: 130% da soma dos raios covalentes
- Evita ligações duplicadas (compara apenas i < j)
- Usa raios covalentes tabelados

**Exemplo:**
```javascript
// C-C: raio(C) = 0.76 Å
// Distância máxima = (0.76 + 0.76) * 1.3 = 1.976 Å

// Se dois carbonos estão a 1.5 Å → cria ligação ✓
// Se dois carbonos estão a 2.5 Å → não cria ligação ✗
```

---

#### `getCovalentRadius(element)`

Retorna o raio covalente de um elemento em Angstroms.

**Parâmetros:**
- `element` (string): Símbolo do elemento

**Retorno:**
- `number`: Raio covalente em Angstroms (padrão: 0.7)

**Raios disponíveis:**

| Elemento | Raio (Å) |
|----------|---------|
| H | 0.31 |
| C | 0.76 |
| N | 0.71 |
| O | 0.66 |
| S | 1.05 |
| P | 1.07 |
| Cl | 1.02 |
| Br | 1.20 |
| Fe | 1.32 |
| Ca | 1.76 |

---

### Constantes

#### `CPK_COLORS`

Objeto com cores CPK para elementos químicos.

**Tipo:** `Object<string, number>`

**Exemplo:**
```javascript
const CPK_COLORS = {
  H: 0xffffff,
  C: 0x000000,
  N: 0x3050f8,
  // ...
};
```

---

#### `COVALENT_RADII`

Objeto com raios covalentes dos elementos em Angstroms.

**Tipo:** `Object<string, number>`

---

## 📦 sceneManager.js

### Funções Públicas

#### `initScene()`

Inicializa a cena Three.js completa.

**Parâmetros:** Nenhum

**Retorno:**
- `THREE.Scene`: Cena inicializada

**Componentes criados:**
1. **Scene**: Fundo preto
2. **Renderer**: WebGLRenderer
3. **Camera**: PerspectiveCamera (FOV 75°, posição [0, 0, 50])
4. **Lights**:
   - AmbientLight (0x404040)
   - DirectionalLight (0xffffff, intensidade 0.5)
5. **Controls**: OrbitControls
6. **Event Listeners**: Resize e click

**Exemplo:**
```javascript
const scene = initScene();
// Cena pronta para receber objetos
```

---

#### `clearScene()`

Remove todos os objetos da cena (exceto luzes e câmera).

**Parâmetros:** Nenhum

**Retorno:** `void`

**Comportamento:**
- Remove apenas objetos do tipo `Group`
- Mantém luzes e câmera
- Limpa memória (dispose de geometrias e materiais)

**Exemplo:**
```javascript
clearScene(); // Remove molécula atual
loadNewMolecule(); // Carrega nova molécula
```

---

#### `getScene()`

Retorna a instância da cena atual.

**Parâmetros:** Nenhum

**Retorno:**
- `THREE.Scene`: Cena atual

**Uso:**
```javascript
const scene = getScene();
scene.add(newObject);
```

---

#### `animate()`

Loop de renderização principal.

**Parâmetros:** Nenhum

**Retorno:** `void`

**Comportamento:**
- Chama `requestAnimationFrame` recursivamente
- Atualiza controles
- Renderiza cena

**Nota:** Chamado automaticamente por `initScene()`, não precisa ser chamado manualmente.

---

### Funções Internas

#### `onWindowResize()`

Ajusta renderer e câmera quando a janela é redimensionada.

**Comportamento:**
```javascript
camera.aspect = window.innerWidth / window.innerHeight;
camera.updateProjectionMatrix();
renderer.setSize(window.innerWidth, window.innerHeight);
```

---

#### `onMouseClick(event)`

Detecta cliques em átomos usando raycasting.

**Parâmetros:**
- `event` (MouseEvent): Evento de clique

**Comportamento:**
1. Converte coordenadas da tela para espaço normalizado (-1 a 1)
2. Cria raio da câmera através do cursor
3. Calcula intersecções com objetos
4. Se atingir átomo, exibe informações
5. Caso contrário, esconde popup

**Exemplo de userData esperado:**
```javascript
sphere.userData = {
  element: "C",
  atom: { serial: 1, name: "CA", x: 10.5, y: 20.3, z: -5.8 }
};
```

---

## 📦 fileLoader.js

### Funções Públicas

#### `loadPDB(url, onSuccess, onError)`

Carrega arquivo PDB de uma URL.

**Parâmetros:**
- `url` (string): URL do arquivo PDB
- `onSuccess` (function): Callback com dados carregados
- `onError` (function): Callback de erro

**Assinatura dos callbacks:**
```javascript
onSuccess(data: string): void
onError(error: Error): void
```

**Exemplo:**
```javascript
loadPDB(
  "pdb/caffeine.pdb",
  (data) => {
    console.log("Carregado:", data.length, "bytes");
    const { atoms, connections } = parsePDB(data);
    createMolecule(atoms, connections, getScene());
  },
  (error) => {
    console.error("Erro:", error.message);
  }
);
```

---

#### `handleFileSelect(event, onSuccess)`

Processa upload de arquivo do usuário.

**Parâmetros:**
- `event` (Event): Evento de input file
- `onSuccess` (function): Callback com dados do arquivo

**Exemplo:**
```javascript
fileInput.addEventListener("change", (e) => {
  handleFileSelect(e, (data) => {
    const { atoms, connections } = parsePDB(data);
    createMolecule(atoms, connections, getScene());
  });
});
```

**Comportamento:**
1. Obtém arquivo do evento
2. Usa FileReader API para ler como texto
3. Chama onSuccess com conteúdo
4. Trata erros de leitura

---

#### `setupFileSelector(onLoadCallback)`

Configura todos os event listeners da UI.

**Parâmetros:**
- `onLoadCallback` (function): Callback chamado após carregar arquivo

**Assinatura:**
```javascript
onLoadCallback(data: string, filename: string): void
```

**Comportamento:**
- Configura listener do select (moléculas do projeto)
- Configura listener do botão "Carregar do Computador"
- Configura listener do botão "Limpar Cena"
- Atualiza nome da molécula exibido

**Exemplo:**
```javascript
setupFileSelector((data, filename) => {
  const { atoms, connections } = parsePDB(data);
  const molecule = createMolecule(atoms, connections, getScene());
  centerMolecule(molecule);
  console.log("Carregado:", filename);
});
```

---

## Fluxo Completo de Uso

```javascript
// 1. Inicializar cena
const scene = initScene();

// 2. Configurar seletor de arquivos
setupFileSelector((data, filename) => {
  
  // 3. Fazer parsing do PDB
  const { atoms, connections } = parsePDB(data);
  
  // 4. Limpar cena anterior
  clearScene();
  
  // 5. Criar molécula
  const molecule = createMolecule(atoms, connections, scene);
  
  // 6. Centralizar molécula
  const bbox = new THREE.Box3().setFromObject(molecule);
  const center = bbox.getCenter(new THREE.Vector3());
  molecule.position.sub(center);
  
  // 7. Ajustar câmera
  const size = bbox.getSize(new THREE.Vector3()).length();
  camera.position.z = size * 2;
  
  console.log(`Molécula ${filename} carregada com ${atoms.length} átomos`);
});

// 8. Animação já iniciada automaticamente
```

---

## Tratamento de Erros

### pdbParser.js
- Retorna arrays vazios se dados inválidos
- Ignora linhas malformadas silenciosamente

### fileLoader.js
- Chama callback de erro em falhas de rede
- Trata erros de FileReader API

### moleculeRenderer.js
- Usa cor padrão (cinza) para elementos desconhecidos
- Usa raio padrão para elementos sem raio covalente

### sceneManager.js
- Valida existência de objetos antes de remover
- Protege contra múltiplas inicializações

---

## Tipos de Dados Personalizados

```typescript
// Átomo
interface Atom {
  serial: number;
  name: string;
  element: string;
  x: number;
  y: number;
  z: number;
}

// Conexão
interface Connection {
  from: number;
  to: number[];
}

// Resultado do parsing
interface ParseResult {
  atoms: Atom[];
  connections: Connection[];
}

// UserData em objetos Three.js
interface AtomUserData {
  element: string;
  atom: Atom;
}
```
