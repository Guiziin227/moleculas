# Stack Tecnológica

Este documento detalha todas as tecnologias, bibliotecas e ferramentas utilizadas no projeto Visualizador de Moléculas PDB.

---

## 📚 Índice

1. [Visão Geral](#visão-geral)
2. [Frontend](#frontend)
3. [Bibliotecas 3D](#bibliotecas-3d)
4. [APIs do Navegador](#apis-do-navegador)
5. [Formatos de Dados](#formatos-de-dados)
6. [Ferramentas de Desenvolvimento](#ferramentas-de-desenvolvimento)
7. [Dependências Futuras](#dependências-futuras)

---

## Visão Geral

### Tipo de Aplicação
- **Single Page Application (SPA)**
- **Client-side rendering**
- **Sem backend** (totalmente estático)

### Filosofia
- **Vanilla JavaScript** (sem frameworks)
- **Módulos ES6** (importação/exportação nativa)
- **Progressive Enhancement**
- **Mobile-first** (planejado)

---

## Frontend

### HTML5

**Versão**: HTML Living Standard

**Recursos utilizados**:
- Elementos semânticos (`<div>`, `<select>`, `<input>`)
- Input type="file" para upload
- Canvas implícito via WebGL

**Por que HTML5?**
- Suporte nativo a canvas e WebGL
- APIs modernas do navegador
- Semântica melhorada

---

### CSS3

**Versão**: CSS3 (módulos individuais)

**Recursos utilizados**:

```css
/* Flexbox para layout */
display: flex;
flex-direction: column;

/* Posicionamento absoluto para UI overlay */
position: absolute;

/* Transparência com rgba */
background: rgba(0, 0, 0, 0.8);

/* Border radius para cantos arredondados */
border-radius: 10px;

/* Pseudo-classes para interatividade */
.button:hover { }

/* Viewport units */
width: 100vw;
height: 100vh;
```

**Frameworks CSS**: Nenhum (CSS vanilla)

**Pré-processadores**: Nenhum (planejado: SASS/SCSS)

**Por que CSS vanilla?**
- Simplicidade e leveza
- Sem build step necessário
- Controle total sobre estilos
- Curva de aprendizado menor

---

### JavaScript (ES6+)

**Versão**: ECMAScript 2015 (ES6) e posteriores

**Recursos ES6+ utilizados**:

```javascript
// 1. Arrow Functions
atoms.forEach((atom) => { ... });

// 2. Template Literals
console.log(`Molécula com ${atoms.length} átomos`);

// 3. Destructuring
const { atoms, connections } = parsePDB(data);

// 4. Spread Operator
const newArray = [...oldArray, newItem];

// 5. Const e Let
const PI = 3.14159;
let counter = 0;

// 6. Default Parameters
function createSphere(radius = 0.5) { ... }

// 7. Object Shorthand
const obj = { x, y, z }; // ao invés de { x: x, y: y, z: z }

// 8. For...of
for (const atom of atoms) { ... }

// 9. Array Methods
const elements = atoms.map(atom => atom.element);
const carbons = atoms.filter(atom => atom.element === "C");

// 10. String Methods
const element = line.substring(76, 78).trim();
```

**Não utilizado (mas disponível)**:
- Classes (optamos por funções e closures)
- Promises (ainda não necessário, mas planejado)
- Async/Await (planejado para Web Workers)
- Modules com import/export (ainda via script tags)

**Por que ES6+?**
- Código mais limpo e legível
- Funcionalidades modernas
- Suportado por todos navegadores modernos
- Sem necessidade de transpilação

**Compatibilidade**:
- Chrome 51+
- Firefox 54+
- Safari 10+
- Edge 15+

---

## Bibliotecas 3D

### Three.js

**Versão**: r128 (setembro 2021)

**CDN**: `https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js`

**Módulos utilizados**:

1. **Core**
   ```javascript
   THREE.Scene
   THREE.PerspectiveCamera
   THREE.WebGLRenderer
   THREE.Group
   ```

2. **Geometrias**
   ```javascript
   THREE.SphereGeometry     // Para átomos
   THREE.CylinderGeometry   // Para ligações
   ```

3. **Materiais**
   ```javascript
   THREE.MeshLambertMaterial  // Átomos (responde à luz)
   THREE.MeshBasicMaterial    // Ligações (sem iluminação)
   ```

4. **Iluminação**
   ```javascript
   THREE.AmbientLight        // Luz ambiente
   THREE.DirectionalLight    // Luz direcional
   ```

5. **Matemática**
   ```javascript
   THREE.Vector3      // Vetores 3D
   THREE.Quaternion   // Rotações
   THREE.Box3         // Bounding boxes
   ```

6. **Utilitários**
   ```javascript
   THREE.Raycaster    // Detecção de cliques
   ```

**Por que Three.js?**
- ✅ Abstração de WebGL complexo
- ✅ Documentação extensa
- ✅ Grande comunidade
- ✅ Performance excelente
- ✅ Ecossistema maduro
- ✅ Atualizações regulares

**Alternativas consideradas**:
- Babylon.js (mais pesado)
- A-Frame (foco em VR/AR)
- PlayCanvas (mais para jogos)

---

### OrbitControls

**Versão**: Three.js r128 (mesma versão)

**CDN**: `https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js`

**Funcionalidades**:
- Rotação orbital com mouse/touch
- Zoom com scroll/pinch
- Pan com botão direito
- Limites configuráveis
- Damping suave

**Configuração**:
```javascript
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 10;
controls.maxDistance = 500;
```

**Por que OrbitControls?**
- Interação intuitiva para visualização 3D
- Funciona em desktop e mobile
- Não requer configuração complexa

**Alternativas**:
- TrackballControls (menos intuitivo)
- FlyControls (para navegação espacial)
- Implementação custom (mais trabalho)

---

## APIs do Navegador

### WebGL

**Versão**: WebGL 1.0

**Uso**: Através do Three.js (abstração)

**Requisitos**:
- GPU com suporte a WebGL
- Navegador moderno
- Drivers de vídeo atualizados

**Verificação de suporte**:
```javascript
function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch (e) {
    return false;
  }
}
```

---

### FileReader API

**Uso**: Leitura de arquivos PDB do computador do usuário

**Exemplo**:
```javascript
const reader = new FileReader();
reader.onload = (e) => {
  const contents = e.target.result;
  // Processar conteúdo
};
reader.readAsText(file);
```

**Suporte**:
- IE 10+
- Todos navegadores modernos

**Recursos utilizados**:
- `readAsText()`: Ler arquivo como string

---

### Fetch API

**Uso**: Carregar arquivos PDB do servidor

**Exemplo**:
```javascript
fetch("pdb/caffeine.pdb")
  .then((response) => response.text())
  .then((data) => {
    // Processar PDB
  })
  .catch((error) => {
    console.error("Erro:", error);
  });
```

**Suporte**:
- Chrome 42+
- Firefox 39+
- Safari 10.1+
- Edge 14+

**Por que Fetch?**
- API moderna e Promise-based
- Mais limpo que XMLHttpRequest
- Suporte nativo a JSON, text, blob

---

### requestAnimationFrame

**Uso**: Loop de renderização 3D

**Exemplo**:
```javascript
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
```

**Vantagens**:
- Sincronizado com refresh rate do monitor (60 FPS)
- Pausado automaticamente em abas inativas
- Melhor performance que setInterval/setTimeout

---

### DOM APIs

**Utilizadas**:
```javascript
// Seleção de elementos
document.getElementById()
document.querySelector()

// Event listeners
element.addEventListener("click", handler)
element.addEventListener("change", handler)
window.addEventListener("resize", handler)

// Manipulação de DOM
element.innerHTML
element.style.property
element.classList.add/remove
```

---

## Formatos de Dados

### PDB (Protein Data Bank)

**Versão**: PDB Format Version 3.30

**Especificação**: [wwPDB](http://www.wwpdb.org/documentation/file-format)

**Registros suportados**:

1. **ATOM**
   ```
   ATOM      1  N   MET A   1      10.500  20.300  -5.800  1.00  0.00           N
   Colunas:
   1-6    "ATOM  "
   7-11   Serial
   13-16  Atom name
   18-20  Residue name
   23-26  Residue sequence
   31-38  X coordinate
   39-46  Y coordinate
   47-54  Z coordinate
   77-78  Element symbol
   ```

2. **HETATM**
   ```
   Mesmo formato de ATOM, para heteroátomos
   ```

3. **CONECT**
   ```
   CONECT    1    2    3    4
   Colunas:
   1-6    "CONECT"
   7-11   Atom serial
   12-16  Bonded atom 1
   17-21  Bonded atom 2
   22-26  Bonded atom 3
   ```

**Por que PDB?**
- Padrão na bioquímica/química
- Amplamente disponível (PDB database)
- Formato texto simples
- Suporte a metadados

**Formatos futuros planejados**:
- MOL2 (mais comum em química orgânica)
- XYZ (mais simples)
- CIF (sucessor do PDB)
- SDF (estruturas 2D/3D)

---

## Ferramentas de Desenvolvimento

### Editor de Código

**Recomendado**: Visual Studio Code

**Extensions úteis**:
- Live Server (preview em tempo real)
- ESLint (linting)
- Prettier (formatação)
- JavaScript (ES6) code snippets
- Three.js Snippets

---

### Navegadores para Desenvolvimento

**Principais**:
- Chrome DevTools
- Firefox Developer Tools

**Recursos usados**:
- Console para debug
- Network tab para verificar carregamento
- Performance profiling
- WebGL Inspector

---

### Controle de Versão

**Git** + **GitHub**

**Workflow**:
- Feature branches
- Pull requests
- Conventional Commits

---

### Servidor Local

**Opções**:

1. **Python**
   ```bash
   python -m http.server 8000
   ```

2. **Node.js**
   ```bash
   npx http-server
   ```

3. **PHP**
   ```bash
   php -S localhost:8000
   ```

4. **VS Code Live Server**
   - Extension com reload automático

**Por que servidor local?**
- Evita problemas de CORS
- Simula ambiente de produção
- Permite usar Fetch API

---

## Dependências Futuras

### Build Tools (Planejado)

**Vite** (recomendado)
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

**Por que Vite?**
- Extremamente rápido
- Hot Module Replacement
- Build otimizado
- Suporte nativo a ES modules

**Alternativas**:
- Webpack (mais configurável, mais complexo)
- Parcel (zero config, mas menos flexível)
- Rollup (para bibliotecas)

---

### Testes (Planejado)

**Jest** (unit tests)
```javascript
test("parsePDB extrai átomos corretamente", () => {
  const data = "ATOM      1  N   MET A   1      10.5  20.3  -5.8  1.00  0.00           N";
  const result = parsePDB(data);
  expect(result.atoms).toHaveLength(1);
  expect(result.atoms[0].element).toBe("N");
});
```

**Playwright** (E2E tests)
```javascript
test("carrega molécula de cafeína", async ({ page }) => {
  await page.goto("http://localhost:8000");
  await page.selectOption("#moleculeSelect", "pdb/caffeine.pdb");
  await page.click("#loadProjectButton");
  await expect(page.locator("#moleName")).toContainText("caffeine.pdb");
});
```

---

### Qualidade de Código (Planejado)

**ESLint**
```json
{
  "extends": "eslint:recommended",
  "env": {
    "browser": true,
    "es6": true
  },
  "rules": {
    "no-console": "warn",
    "no-unused-vars": "error"
  }
}
```

**Prettier**
```json
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "trailingComma": "es5"
}
```

---

### TypeScript (Considerado)

**Vantagens**:
- Type safety
- Autocompletion melhorado
- Refactoring mais seguro
- Documentação implícita

**Desvantagens**:
- Complexidade adicional
- Build step obrigatório
- Curva de aprendizado

**Decisão**: Avaliar após implementar testes

---

## Comparação com Alternativas

### Por que não usar um framework?

| Framework | Prós | Contras | Decisão |
|-----------|------|---------|---------|
| **React** | Componentes, ecosystem | Overhead, build necessário | ❌ Muito para projeto simples |
| **Vue** | Simplicidade, reatividade | Ainda requer build | ❌ Não justifica complexidade |
| **Svelte** | Sem runtime, performance | Menos maduro | ❌ Vanilla é suficiente |
| **Vanilla JS** | Zero overhead, simples | Mais código manual | ✅ **Escolhido** |

### Por que Three.js e não WebGL puro?

| Opção | Prós | Contras | Decisão |
|-------|------|---------|---------|
| **WebGL puro** | Controle total, performance máxima | Muito complexo, produtividade baixa | ❌ Reinventar a roda |
| **Three.js** | Abstração útil, produtivo | Leve overhead | ✅ **Escolhido** |
| **Babylon.js** | Poderoso, completo | Mais pesado, overkill | ❌ Demais para o projeto |

---

## Conclusão

A stack escolhida prioriza:
- ✅ **Simplicidade**: Vanilla JS, sem build
- ✅ **Performance**: Three.js otimizado
- ✅ **Manutenibilidade**: Código modular
- ✅ **Acessibilidade**: Funciona em qualquer navegador moderno
- ✅ **Extensibilidade**: Fácil adicionar features

**Trade-offs aceitos**:
- ❌ Sem reatividade automática (não é necessário)
- ❌ Mais código boilerplate (compensado pela simplicidade)
- ❌ Sem type checking (pode ser adicionado depois)

**Futuro**:
- Adicionar build tools (Vite)
- Implementar testes (Jest + Playwright)
- Considerar TypeScript
- PWA capabilities
