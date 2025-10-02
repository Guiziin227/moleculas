# Notas de Desenvolvimento

Este arquivo contém logs e notas sobre o processo de desenvolvimento do projeto, decisões técnicas, problemas encontrados e suas soluções.

---

## 📅 Log de Desenvolvimento

### 2024-10-02 - Documentação Completa

**Atividade**: Criação de documentação detalhada

**Arquivos criados**:
- `ARCHITECTURE.md` - Arquitetura e design patterns
- `API.md` - Documentação completa de todas as funções
- `CHANGELOG.md` - Histórico de versões
- `CONTRIBUTING.md` - Guia para contribuidores
- `TECH_STACK.md` - Stack tecnológica detalhada
- `DEVELOPMENT_NOTES.md` - Este arquivo

**Motivação**:
- Facilitar onboarding de novos desenvolvedores
- Documentar decisões técnicas
- Criar referência completa da API
- Estabelecer processo de contribuição

---

### 2024-10-01 - Refatoração Modular Completa

**Problema**: Código monolítico difícil de manter

**Solução**: Separação em 4 módulos independentes

**Módulos criados**:
1. `js/pdbParser.js` - Parsing de PDB
2. `js/moleculeRenderer.js` - Renderização 3D
3. `js/sceneManager.js` - Gerenciamento da cena
4. `js/fileLoader.js` - Carregamento de arquivos

**Benefícios observados**:
- ✅ Código mais organizado
- ✅ Facilidade para adicionar features
- ✅ Debug mais simples
- ✅ Reutilização de código

**Tempo de refatoração**: ~6 horas

**Desafios**:
- Decidir responsabilidades de cada módulo
- Evitar dependências circulares
- Manter compatibilidade com código anterior

---

### 2024-09-28 - Sistema Híbrido de Ligações

**Problema**: Alguns arquivos PDB não têm registros CONECT

**Contexto**:
- Arquivos de proteínas geralmente têm CONECT
- Moléculas pequenas nem sempre
- Visualização ficava sem ligações

**Tentativa 1**: Sempre usar CONECT
```javascript
// ❌ Falha: moléculas sem CONECT não mostravam ligações
if (connections.length > 0) {
  createBondsFromConect(atomMap, connections, group);
}
```

**Tentativa 2**: Sempre calcular por distância
```javascript
// ❌ Falha: ignorava informações explícitas do PDB
createBondsFromDistance(atoms, group);
```

**Solução Final**: Sistema híbrido
```javascript
// ✅ Melhor de ambos os mundos
if (connections && connections.length > 0) {
  createBondsFromConect(atomMap, connections, group);
} else {
  createBondsFromDistance(atoms, group);
}
```

**Aprendizado**:
- Sempre ter fallback
- Priorizar dados explícitos
- Testar com diversos arquivos

---

### 2024-09-25 - Detecção de Elementos de 2 Letras

**Problema**: Elementos como Fe, Ca, Cl eram detectados como F, C, C

**Investigação**:
```
ATOM     20  FE  HEM A   1      15.2  18.7  -2.3  1.00  0.00          FE
                ^^                                                     ^^
            Coluna 13-14                                          Coluna 77-78
```

**Descoberta**: PDB tem campo específico para elemento (colunas 77-78)

**Solução implementada**:
```javascript
// 1. Tentar colunas 77-78 (padrão)
let element = line.substring(76, 78).trim();

if (!element) {
  // 2. Fallback: extrair do nome do átomo
  let atomName = line.substring(12, 16).trim();
  
  // Remover números iniciais (ex: "2CA" → "CA")
  atomName = atomName.replace(/^\d+/, "");
  
  // Checar se é elemento de 2 letras conhecido
  if (TWO_LETTER_ELEMENTS.includes(atomName.toUpperCase())) {
    element = atomName.substring(0, 2);
  } else {
    element = atomName.charAt(0);
  }
}
```

**Testes realizados**:
- ✅ Fe (ferro) - detectado corretamente
- ✅ Ca (cálcio) - detectado corretamente
- ✅ Cl (cloro) - detectado corretamente
- ✅ C (carbono) - ainda funciona
- ✅ N (nitrogênio) - ainda funciona

**Aprendizado**:
- Sempre ler especificação do formato
- Múltiplas estratégias são melhores que uma
- Validar contra lista conhecida

---

### 2024-09-22 - Centralização Automática

**Problema**: Moléculas apareciam fora do campo de visão

**Contexto**:
- Coordenadas PDB não são centralizadas
- Algumas moléculas estão em posições arbitrárias
- Usuário tinha que procurar a molécula

**Solução implementada**:
```javascript
// 1. Calcular bounding box
const bbox = new THREE.Box3().setFromObject(molecule);

// 2. Encontrar centro
const center = bbox.getCenter(new THREE.Vector3());

// 3. Centralizar molécula
molecule.position.sub(center);

// 4. Ajustar câmera
const size = bbox.getSize(new THREE.Vector3()).length();
const distance = size * 1.5; // Margem de 50%
camera.position.set(0, 0, distance);
```

**Melhorias adicionais**:
- Limitar distância mínima/máxima
- Transição suave (planejado)
- Preservar orientação (planejado)

---

### 2024-09-20 - Cores CPK Expandidas

**Decisão**: Usar cores CPK padrão da química

**Pesquisa**:
- CPK = Corey-Pauling-Koltun
- Convenção estabelecida em 1952
- Amplamente usada em visualização molecular

**Cores principais implementadas**:
```javascript
const CPK_COLORS = {
  H: 0xffffff,  // Branco
  C: 0x000000,  // Preto
  N: 0x3050f8,  // Azul
  O: 0xff0d0d,  // Vermelho
  S: 0xffff30,  // Amarelo
  P: 0xff8000,  // Laranja
  // ... 40+ elementos
};
```

**Fonte**: [Wikipedia - CPK Coloring](https://en.wikipedia.org/wiki/CPK_coloring)

**Alternativas consideradas**:
- Jmol colors (mais vibrantes)
- Rasmol colors (semelhante a CPK)
- Cores customizáveis (complexidade desnecessária)

**Decisão**: CPK por ser padrão reconhecido

---

### 2024-09-18 - Raycasting para Cliques

**Objetivo**: Permitir clicar em átomos para ver informações

**Implementação**:
```javascript
function onMouseClick(event) {
  // 1. Converter coordenadas da tela para espaço normalizado
  const mouse = new THREE.Vector2();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  
  // 2. Criar raio da câmera
  const raycaster = new THREE.Raycaster();
  raycaster.setFromCamera(mouse, camera);
  
  // 3. Verificar intersecções
  const intersects = raycaster.intersectObjects(scene.children, true);
  
  if (intersects.length > 0) {
    const object = intersects[0].object;
    if (object.userData.element) {
      showAtomInfo(object.userData);
    }
  }
}
```

**Desafios**:
- Coordenadas de tela vs. espaço 3D
- Performance com muitos objetos
- Detectar apenas átomos (não ligações)

**Solução para performance**:
- Limitar recursive search
- Usar userData para filtrar
- Apenas primeiro hit (intersects[0])

---

### 2024-09-15 - Primeira Versão (Monolítica)

**Abordagem**: Tudo em um arquivo HTML

**Estrutura**:
```html
<script>
  // Todas as funções no mesmo arquivo
  function parsePDB() { ... }
  function createMolecule() { ... }
  function initScene() { ... }
  // ...
</script>
```

**Vantagens**:
- Rápido para prototipar
- Sem complexidade de módulos
- Fácil de compartilhar (um arquivo)

**Desvantagens**:
- Difícil de manter
- Não reutilizável
- Debug complicado
- Merge conflicts

**Lição aprendida**: 
- Protótipos podem ser monolíticos
- Refatorar antes de crescer muito

---

## 🤔 Decisões Técnicas

### Por que Vanilla JavaScript?

**Prós**:
- Zero dependencies (exceto Three.js)
- Sem build step
- Rápido para começar
- Fácil de entender
- Sem overhead de framework

**Contras**:
- Mais código boilerplate
- Sem reatividade automática
- Manipulação de DOM manual

**Decisão**: Prós superam contras para este projeto

**Reavaliação**: Se crescer muito, considerar framework

---

### Por que Three.js r128 (não latest)?

**Razão**: Estabilidade

**Contexto**:
- r128 lançado em setembro 2021
- Bem testado e estável
- OrbitControls funcionam bem
- Documentação abundante

**Trade-off**:
- Não tem features mais recentes
- Alguns deprecation warnings

**Plano**: Atualizar para versão mais recente após:
- Implementar testes
- Verificar breaking changes
- Testar compatibilidade

---

### Por que não usar Classes?

**Abordagem atual**: Funções + Closures

```javascript
// Ao invés de:
class PDBParser {
  parse(data) { ... }
}

// Usamos:
function parsePDB(data) { ... }
```

**Razões**:
- Simplicidade
- Não precisamos de estado compartilhado
- Funções puras são mais testáveis
- Evita complexidade de `this`

**Quando considerar classes**:
- Se houver estado complexo
- Se precisar de herança
- Se crescer muito

---

### Sistema de Coordenadas

**PDB**: Sistema cartesiano, Angstroms (Å)
```
X: horizontal (direita positivo)
Y: vertical (cima positivo)  
Z: profundidade (frente positivo)
```

**Three.js**: Mesmo sistema
```
X: direita
Y: cima
Z: frente (em direção à câmera)
```

**Vantagem**: Conversão direta, sem transformação

---

### Unidades

**PDB**: Angstroms (1 Å = 0.1 nm)

**Three.js**: Unidades arbitrárias (interpretamos como Angstroms)

**Exemplo**:
```
Distância C-C típica: ~1.5 Å
No Three.js: 1.5 unidades
```

**Raios de átomos**: Escalados para visualização
```
Raio real do carbono: 0.70 Å
Raio renderizado: 0.5 unidades (para melhor visualização)
```

---

## 🐛 Bugs Encontrados e Resolvidos

### Bug #1: Ligações Duplicadas

**Sintoma**: Cada ligação aparecia 2x (uma de A→B, outra de B→A)

**Causa**:
```javascript
// ❌ Código problemático
for (let i = 0; i < atoms.length; i++) {
  for (let j = 0; j < atoms.length; j++) {
    if (i !== j && areClose(atoms[i], atoms[j])) {
      createBond(atoms[i], atoms[j]);
    }
  }
}
```

**Solução**:
```javascript
// ✅ Comparar apenas i < j
for (let i = 0; i < atoms.length; i++) {
  for (let j = i + 1; j < atoms.length; j++) {
    if (areClose(atoms[i], atoms[j])) {
      createBond(atoms[i], atoms[j]);
    }
  }
}
```

---

### Bug #2: Memory Leak ao Trocar Moléculas

**Sintoma**: Navegador ficava lento após carregar várias moléculas

**Causa**: Objetos Three.js não eram removidos da memória

**Solução**:
```javascript
function clearScene() {
  scene.children.forEach((child) => {
    if (child.type === "Group") {
      child.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) obj.material.dispose();
      });
      scene.remove(child);
    }
  });
}
```

**Lição**: Sempre dispose de geometrias e materiais

---

### Bug #3: Popup Não Sumia

**Sintoma**: Popup de informações ficava travado na tela

**Causa**: Evento de click só mostrava, nunca escondia

**Solução**:
```javascript
function onMouseClick(event) {
  const intersects = raycaster.intersectObjects(scene.children, true);
  
  if (intersects.length > 0 && intersects[0].object.userData.element) {
    showAtomInfo(intersects[0].object.userData);
  } else {
    hideAtomInfo(); // ← Adicionado
  }
}
```

---

### Bug #4: Câmera Muito Longe/Perto

**Sintoma**: Algumas moléculas apareciam minúsculas, outras não cabiam na tela

**Causa**: Distância fixa da câmera

**Solução**: Calcular distância baseada no tamanho da molécula
```javascript
const size = bbox.getSize(new THREE.Vector3()).length();
const distance = size * 1.5; // 50% de margem
camera.position.z = distance;
```

---

## 💡 Ideias para o Futuro

### Prioridade Alta

- [ ] **Testes Automatizados**
  - Unit tests para parser
  - Integration tests para renderização
  - E2E tests para UI

- [ ] **Performance para Moléculas Grandes**
  - Instancing para átomos repetidos
  - LOD (Level of Detail)
  - Web Workers para parsing

- [ ] **Suporte a MOL2**
  - Formato comum em química orgânica
  - Parser similar ao PDB

### Prioridade Média

- [ ] **Visualizações Alternativas**
  - Ball-and-stick configurável
  - Space-filling
  - Wireframe

- [ ] **Medições**
  - Distâncias entre átomos
  - Ângulos
  - Ângulos diedrais

- [ ] **Exportação**
  - Screenshots PNG/JPG
  - Modelo 3D (OBJ/STL)
  - Dados (JSON)

### Prioridade Baixa

- [ ] **Animações**
  - Vibração molecular
  - Trajetórias de MD
  - Transições suaves

- [ ] **Comparação**
  - Carregar múltiplas moléculas
  - Overlay de estruturas
  - Diff visualization

---

## 📚 Recursos e Referências

### Documentação Oficial

- [PDB Format Guide](http://www.wwpdb.org/documentation/file-format)
- [Three.js Documentation](https://threejs.org/docs/)
- [WebGL Fundamentals](https://webglfundamentals.org/)

### Tutoriais Úteis

- [Three.js Journey](https://threejs-journey.com/)
- [Discover three.js](https://discoverthreejs.com/)
- [WebGL2 Fundamentals](https://webgl2fundamentals.org/)

### Ferramentas

- [PDB Viewer Online](https://www.rcsb.org/3d-view)
- [Mol* Viewer](https://molstar.org/)
- [PyMOL](https://pymol.org/)

### Artigos

- [CPK Coloring](https://en.wikipedia.org/wiki/CPK_coloring)
- [Molecular Graphics](https://en.wikipedia.org/wiki/Molecular_graphics)
- [WebGL Best Practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices)

---

## 🎯 Métricas do Projeto

### Linhas de Código

```
index.html          : ~180 linhas
js/pdbParser.js     : ~170 linhas
js/moleculeRenderer.js : ~320 linhas
js/sceneManager.js  : ~150 linhas
js/fileLoader.js    : ~100 linhas
--------------------------------
Total              : ~920 linhas
```

### Arquivos PDB

```
Total: 14 moléculas
Tamanho médio: ~50 KB
Maior: heroin.pdb (~80 KB)
Menor: nacl.pdb (~1 KB)
```

### Performance

```
Molécula pequena (<50 átomos):
- Parsing: <5ms
- Rendering: <10ms
- FPS: 60

Molécula média (50-500 átomos):
- Parsing: ~20ms
- Rendering: ~50ms
- FPS: 60

Molécula grande (>500 átomos):
- Parsing: ~100ms
- Rendering: ~200ms
- FPS: 50-60
```

---

## 🔍 Lições Aprendidas

### Técnicas

1. **Separation of Concerns é fundamental**
   - Facilita debug
   - Permite reutilização
   - Torna código mais testável

2. **Sempre ter fallbacks**
   - CONECT pode não existir
   - Elementos podem ser desconhecidos
   - Arquivos podem ser inválidos

3. **Performance importa**
   - Dispose de recursos
   - Evite recriação desnecessária
   - Profile antes de otimizar

4. **Documentação economiza tempo**
   - Menos perguntas depois
   - Facilita contribuições
   - Você mesmo agradece no futuro

### Processuais

1. **Prototipar rápido, refatorar depois**
   - Arquivo monolítico foi útil no início
   - Refatoração foi essencial para crescer

2. **Testar com dados reais**
   - Diferentes formatos de PDB
   - Moléculas de vários tamanhos
   - Edge cases aparecem

3. **Git commits pequenos e frequentes**
   - Facilita reverter
   - Histórico mais claro
   - Menos conflitos

---

## 📝 TODOs Técnicos

### Código

- [ ] Adicionar JSDoc em todas funções
- [ ] Criar arquivo de constantes separado
- [ ] Extrair cores CPK para JSON
- [ ] Implementar error boundaries
- [ ] Adicionar logging estruturado

### Testes

- [ ] Setup Jest
- [ ] Testes unitários para pdbParser
- [ ] Testes para moleculeRenderer
- [ ] Testes E2E com Playwright
- [ ] Coverage > 80%

### DevOps

- [ ] Setup CI/CD (GitHub Actions)
- [ ] Deploy automático (GitHub Pages)
- [ ] Lighthouse CI
- [ ] Automated releases

### Documentação

- [ ] API reference completa ✅
- [ ] Tutoriais de uso
- [ ] Vídeos demonstrativos
- [ ] FAQ

---

Última atualização: 2024-10-02
