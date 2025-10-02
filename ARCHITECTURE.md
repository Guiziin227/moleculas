# Arquitetura do Projeto

## Visão Geral

O Visualizador de Moléculas PDB é uma aplicação web que utiliza uma arquitetura modular baseada em JavaScript vanilla e Three.js. O projeto foi refatorado de uma implementação monolítica para uma estrutura modular, facilitando a manutenção e extensibilidade.

## Diagrama de Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                        index.html                            │
│  (Interface do Usuário + Orquestração dos Módulos)          │
└────────────┬────────────────────────────────────────────────┘
             │
             ├──────────────────────────────────────────────────┐
             │                                                   │
             ▼                                                   ▼
    ┌────────────────┐                              ┌────────────────────┐
    │  fileLoader.js │                              │  sceneManager.js   │
    │                │                              │                    │
    │ • Carrega PDB  │                              │ • Inicializa cena  │
    │ • Upload File  │                              │ • Controles        │
    │ • UI Events    │                              │ • Raycasting       │
    └────────┬───────┘                              └─────────┬──────────┘
             │                                                 │
             ▼                                                 │
    ┌────────────────┐                                        │
    │  pdbParser.js  │                                        │
    │                │                                        │
    │ • Parse PDB    │                                        │
    │ • Extrai dados │                                        │
    │ • CONECT       │                                        │
    └────────┬───────┘                                        │
             │                                                 │
             ▼                                                 ▼
    ┌────────────────────────────────────────────────────────────┐
    │              moleculeRenderer.js                           │
    │                                                            │
    │  • Renderiza átomos (esferas)                             │
    │  • Cria ligações (cilindros)                              │
    │  • Sistema híbrido: CONECT + distância                    │
    │  • Cores CPK                                              │
    └────────────────────────────────────────────────────────────┘
```

## Fluxo de Dados

### 1. Carregamento de Arquivo

```
Usuário seleciona arquivo
        ↓
fileLoader.js carrega o conteúdo
        ↓
pdbParser.js faz o parsing
        ↓
Retorna {atoms: [], connections: []}
        ↓
moleculeRenderer.js cria a molécula 3D
        ↓
sceneManager.js centraliza e exibe
```

### 2. Interação do Usuário

```
Usuário clica na cena
        ↓
sceneManager.js detecta clique (raycasting)
        ↓
Identifica átomo clicado
        ↓
Exibe informações do elemento
```

## Módulos Detalhados

### 📁 fileLoader.js

**Responsabilidade**: Gerenciamento de arquivos e interface do usuário

**Dependências**: 
- pdbParser.js (para processar dados)
- sceneManager.js (para limpar cena)
- moleculeRenderer.js (para renderizar)

**Funções públicas**:
- `loadPDB(url, onSuccess, onError)`: Carrega arquivo via URL
- `handleFileSelect(event, onSuccess)`: Processa upload do usuário
- `setupFileSelector(onLoadCallback)`: Configura eventos da UI

**Fluxo interno**:
1. Captura evento de seleção
2. Lê arquivo (FileReader API ou fetch)
3. Chama callback com dados brutos
4. Trata erros de carregamento

---

### 📁 pdbParser.js

**Responsabilidade**: Parsing e interpretação de arquivos PDB

**Dependências**: Nenhuma (módulo puro)

**Estrutura de dados de saída**:
```javascript
{
  atoms: [
    {
      serial: 1,
      name: "CA",
      element: "C",
      x: 10.5,
      y: 20.3,
      z: -5.8
    },
    // ...
  ],
  connections: [
    {
      from: 1,
      to: [2, 3, 4]
    },
    // ...
  ]
}
```

**Funções públicas**:
- `parsePDB(data)`: Processa string PDB completa
- `extractElement(line)`: Extrai símbolo químico

**Lógica de parsing**:
1. Divide arquivo em linhas
2. Identifica registros ATOM/HETATM
3. Extrai coordenadas (colunas fixas)
4. Detecta elemento químico (múltiplas estratégias)
5. Processa registros CONECT
6. Retorna estrutura normalizada

**Estratégias de detecção de elemento**:
- Colunas 77-78 (padrão PDB)
- Colunas 13-16 (nome do átomo)
- Validação de elementos de 2 letras

---

### 📁 moleculeRenderer.js

**Responsabilidade**: Renderização 3D de moléculas

**Dependências**: 
- Three.js (biblioteca externa)

**Funções públicas**:
- `createMolecule(atoms, connections, scene)`: Renderiza molécula completa
- `getAtomColor(element)`: Retorna cor CPK
- `createBond(atom1, atom2, group, length)`: Cria ligação individual

**Funções internas**:
- `createBondsFromConect(atomMap, connections, group)`: Usa dados CONECT
- `createBondsFromDistance(atoms, group)`: Calcula ligações automaticamente
- `getCovalentRadius(element)`: Retorna raio covalente

**Sistema Híbrido de Ligações**:

```javascript
if (connections && connections.length > 0) {
  // Usa dados explícitos do arquivo PDB
  createBondsFromConect(atomMap, connections, moleculeGroup);
} else {
  // Calcula automaticamente por distância
  createBondsFromDistance(atoms, moleculeGroup);
}
```

**Critérios de ligação automática**:
- Distância entre átomos < (raio1 + raio2) × 1.3
- Usa raios covalentes tabelados
- Evita ligações duplicadas

**Renderização de átomos**:
- Geometria: SphereGeometry(raio, 32, 32)
- Material: MeshLambertMaterial (responde à luz)
- Raio padrão: 0.5 unidades
- Cores: Padrão CPK

**Renderização de ligações**:
- Geometria: CylinderGeometry(0.15, 0.15, comprimento, 8)
- Material: MeshBasicMaterial (cor cinza)
- Orientação: Calculada via quaternions

---

### 📁 sceneManager.js

**Responsabilidade**: Gerenciamento da cena Three.js e interações

**Dependências**: 
- Three.js
- OrbitControls.js

**Funções públicas**:
- `initScene()`: Inicialização completa
- `clearScene()`: Remove objetos
- `getScene()`: Acesso à cena
- `animate()`: Loop de renderização

**Configuração da cena**:
```javascript
Scene (fundo preto)
  ├── Camera (PerspectiveCamera, FOV 75°)
  ├── Lights
  │   ├── AmbientLight (0x404040)
  │   └── DirectionalLight (0xffffff, 0.5)
  ├── OrbitControls
  └── Molecule Group (adicionado dinamicamente)
```

**Sistema de Raycasting**:
- Detecta cliques em átomos
- Calcula intersecções 3D
- Exibe informações em popup

**Auto-centralização**:
1. Calcula bounding box da molécula
2. Centraliza em relação à origem
3. Ajusta câmera para enquadrar
4. Distância calculada dinamicamente

**Controles disponíveis**:
- Rotação: Arrastar com botão esquerdo
- Zoom: Scroll do mouse
- Pan: Botão direito + arrastar

---

## Padrões de Design Utilizados

### 1. **Module Pattern**
Cada arquivo JS é um módulo independente com funções públicas e privadas.

### 2. **Separation of Concerns**
- Parsing ≠ Renderização ≠ Interface
- Cada módulo tem responsabilidade única

### 3. **Dependency Injection**
Funções recebem dependências como parâmetros:
```javascript
createMolecule(atoms, connections, scene)
```

### 4. **Factory Pattern**
Funções que criam objetos Three.js complexos:
```javascript
createBond(atom1, atom2, group, length)
```

### 5. **Strategy Pattern**
Sistema híbrido de criação de ligações:
- Estratégia 1: CONECT explícito
- Estratégia 2: Cálculo por distância

## Decisões de Design

### Por que JavaScript Vanilla?
- Simplicidade: Sem build tools
- Performance: Sem overhead de frameworks
- Aprendizado: Código mais direto
- Portabilidade: Funciona em qualquer navegador moderno

### Por que Three.js?
- Biblioteca madura para WebGL
- Abstração de complexidade 3D
- Grande comunidade
- Documentação extensa

### Por que Sistema Híbrido de Ligações?
- Arquivos PDB nem sempre têm CONECT
- Cálculo automático garante visualização
- CONECT tem prioridade quando disponível
- Flexibilidade para diferentes fontes

### Por que Cores CPK?
- Padrão na química molecular
- Reconhecível por profissionais
- Cores distintas facilitam identificação

## Extensibilidade

### Como adicionar novo formato de arquivo?

1. Criar novo parser em `js/newFormatParser.js`
2. Implementar função que retorna `{atoms, connections}`
3. Atualizar `fileLoader.js` para detectar formato
4. Não é necessário alterar renderer

### Como adicionar nova representação 3D?

1. Criar nova função de renderização em `moleculeRenderer.js`
2. Exemplo: `createBallAndStick()`, `createSpaceFilling()`
3. Adicionar opção na UI
4. Chamar função apropriada em `index.html`

### Como adicionar novos elementos químicos?

1. Atualizar `CPK_COLORS` em `moleculeRenderer.js`
2. Atualizar `COVALENT_RADII` se necessário
3. Adicionar a `TWO_LETTER_ELEMENTS` em `pdbParser.js` se for elemento de 2 letras

## Performance

### Otimizações Implementadas

1. **Geometrias reutilizáveis**: Mesma geometria para átomos do mesmo tipo
2. **Raycasting eficiente**: Apenas em objetos interativos
3. **Renderização sob demanda**: Apenas quando necessário
4. **Cálculo de ligações otimizado**: Evita comparações desnecessárias

### Limitações Conhecidas

- Moléculas muito grandes (>10,000 átomos) podem causar lentidão
- Recriação completa da cena ao trocar molécula
- Sem LOD (Level of Detail) implementado

## Possíveis Melhorias Futuras

1. **Object Pooling**: Reutilizar objetos Three.js
2. **Web Workers**: Parser em thread separada
3. **Instancing**: Para muitos átomos idênticos
4. **LOD**: Simplificar visualização de longe
5. **Caching**: Guardar moléculas já carregadas
6. **Animações**: Transições suaves entre moléculas
7. **Múltiplos estilos**: Ball-and-stick, space-filling, ribbon
8. **Exportação**: Salvar imagens/screenshots
9. **Medições**: Distâncias e ângulos entre átomos
10. **Seleção múltipla**: Selecionar vários átomos

## Compatibilidade

- **Navegadores suportados**: Chrome, Firefox, Safari, Edge (versões modernas)
- **WebGL**: Requerido
- **ES6**: Necessário (const, arrow functions, template strings)
- **FileReader API**: Para upload de arquivos

## Estrutura de Pastas Recomendada

```
moleculas/
├── docs/               # Documentação adicional (futuro)
├── js/
│   ├── core/          # Módulos principais (futuro)
│   ├── utils/         # Utilitários (futuro)
│   └── parsers/       # Múltiplos parsers (futuro)
├── pdb/               # Arquivos de exemplo
├── tests/             # Testes unitários (futuro)
├── assets/            # Imagens, ícones (futuro)
└── index.html         # Entry point
```
