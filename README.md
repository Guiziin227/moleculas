# Visualizador de Moléculas PDB

Um visualizador interativo de moléculas em 3D usando Three.js, que lê arquivos PDB (Protein Data Bank).

## 🏗️ Estrutura do Projeto

```
moleculas/
├── index-new.html          # Arquivo HTML principal (refatorado)
├── a.html                  # Versão anterior (monolítica)
├── js/
│   ├── pdbParser.js        # Parser de arquivos PDB
│   ├── moleculeRenderer.js # Renderização 3D das moléculas
│   ├── sceneManager.js     # Gerenciamento da cena Three.js
│   └── fileLoader.js       # Carregamento de arquivos
└── pdb/                    # Moléculas disponíveis
    ├── aspirin.pdb
    ├── caffeine.pdb
    ├── nacl.pdb
    └── ...
```

## 📦 Módulos JavaScript

### 1. **pdbParser.js**

Responsável por fazer o parsing de arquivos PDB.

**Funções principais:**

- `parsePDB(data)` - Faz o parsing completo do arquivo PDB
- `extractElement(line)` - Extrai o símbolo do elemento químico

**Características:**

- Reconhece elementos de 1 letra (C, N, O, etc.)
- Reconhece elementos de 2 letras (Na, Ca, Cl, Al, etc.)
- Suporta formato PDB padrão (colunas 77-78) e alternativo (colunas 13-16)

### 2. **moleculeRenderer.js**

Responsável por renderizar as moléculas em 3D.

**Funções principais:**

- `createMolecule(atoms, connections, scene)` - Cria a representação 3D da molécula
- `getAtomColor(element)` - Retorna a cor CPK do elemento
- `createBond(atom1, atom2, group, length)` - Cria ligações entre átomos
- `createBondsFromConect(atomMap, connections, group)` - Cria ligações via CONECT
- `createBondsFromDistance(atoms, group)` - Cria ligações automaticamente por distância

**Características:**

- Usa cores CPK (Corey-Pauling-Koltun) padrão
- Cria esferas para átomos
- Cria cilindros para ligações
- **Sistema híbrido**: Usa CONECT quando disponível, senão calcula automaticamente
- Raios covalentes para detecção automática de ligações

### 3. **sceneManager.js**

Gerencia a cena Three.js e interações.

**Funções principais:**

- `initScene()` - Inicializa a cena, câmera e renderer
- `clearScene()` - Limpa todos os objetos da cena
- `getScene()` - Retorna a cena atual
- `animate()` - Loop de animação

**Características:**

- Configuração de câmera e controles de órbita
- Detecção de cliques em átomos (raycasting)
- Exibição de informações dos átomos

### 4. **fileLoader.js**

Gerencia o carregamento de arquivos PDB.

**Funções principais:**

- `loadPDB(url, onSuccess, onError)` - Carrega arquivo de uma URL
- `handleFileSelect(event, onSuccess)` - Manipula upload de arquivo
- `setupFileSelector(onLoadCallback)` - Configura os listeners da UI

## 🚀 Como Usar

1. Abra o arquivo `index-new.html` em um navegador web
2. Escolha uma das opções:

   - **Moléculas do Projeto**: Selecione uma molécula pré-carregada
   - **Carregar do Computador**: Faça upload de um arquivo .pdb

3. A molécula será **automaticamente centralizada e enquadrada** na tela

4. Interaja com a molécula:
   - **Arrastar** (botão esquerdo): Rotacionar a molécula
   - **Scroll**: Zoom in/out
   - **Clicar em átomo**: Ver informações do elemento
   - **Botão direito + arrastar**: Panorâmica


## 🔧 Correções Implementadas

### Problema do Parsing de Elementos

**Problema Original:** Elementos como "Na" (sódio) e "Ca" (cálcio) estavam sendo lidos apenas como "N" e "C".

**Solução:**

- Implementada lista completa de elementos de 2 letras da tabela periódica
- Verificação inteligente que reconhece quando um elemento tem 2 letras
- Conversão correta de maiúsculas (PDB) para formato capitalizado (Na, Ca, etc.)

## 🎨 Cores CPK dos Elementos

O visualizador usa o esquema de cores CPK (Corey-Pauling-Koltun):

- **H** - Branco
- **C** - Preto
- **N** - Azul
- **O** - Vermelho
- **Na** - Violeta
- **Ca** - Verde escuro
- **Cl** - Verde
- E muitos outros...

## 📝 Arquivos PDB Suportados

O visualizador suporta arquivos PDB com:

- Linhas `ATOM` e `HETATM`
- Linhas `CONECT` para ligações químicas (opcional)
- Formato padrão PDB (colunas fixas)

### 🔗 Sistema de Ligações Inteligente

- **Com CONECT**: Usa as conexões explícitas do arquivo (mais preciso)
- **Sem CONECT**: Cria ligações automaticamente baseadas na distância entre átomos
- **Raios Covalentes**: Usa raios covalentes dos elementos para determinar ligações válidas
- **Tolerância**: 15% de margem para ligações ligeiramente esticadas


## 🛠️ Tecnologias Utilizadas

- **Three.js** (r128) - Renderização 3D
- **OrbitControls** - Controles de câmera
- **JavaScript ES6** - Módulos e funcionalidades modernas

## 📄 Licença

Este projeto é de uso educacional e científico.
