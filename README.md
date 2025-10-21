# Visualizador de Moléculas PDB com Realidade Aumentada

Um visualizador interativo de moléculas em 3D e AR usando Three.js e WebXR, que lê arquivos PDB (Protein Data Bank).

## 🌟 Recursos

- 📱 **Realidade Aumentada (AR)** - Visualize moléculas no mundo real usando seu smartphone
- 🖥️ **Visualizador 3D** - Visualização tradicional no navegador
- 🔄 **Carregamento flexível** - Use moléculas pré-definidas ou carregue seus próprios arquivos PDB
- 🎨 **Cores CPK** - Representação padrão científica com cores Corey-Pauling-Koltun
- 🔗 **Ligações inteligentes** - Detecção automática ou uso de dados CONECT

## 🚀 Como Usar

### Opção 1: Visualizador 3D Normal (Qualquer dispositivo)

1. Abra `index.html` no navegador
2. Selecione uma molécula
3. Interaja usando mouse/touch:
   - **Arrastar**: Rotacionar
   - **Scroll/Pinça**: Zoom
   - **Clicar em átomo**: Ver informações

### Opção 2: Realidade Aumentada (Smartphone)

#### ⚠️ Requisitos para AR:

- 📱 Dispositivo móvel Android 8+ ou iOS 12+
- 🌐 Chrome, Edge ou Safari atualizado
- 🔒 Conexão HTTPS ou localhost
- 📷 Permissão de acesso à câmera
- 🥽 Suporte ARCore (Android) ou ARKit (iOS)

#### Passo a passo:

1. **Iniciar servidor local** (necessário para acesso à câmera):
   ```bash
   # Windows
   .\iniciar-servidor.bat
   
   # Ou manualmente com Python
   python -m http.server 8000
   ```

2. **Acessar no smartphone**:
   - Conecte o smartphone na **mesma rede Wi-Fi** do computador
   - Descubra o IP do computador:
     ```powershell
     ipconfig
     ```
   - No smartphone, acesse: `http://SEU_IP:8000`

3. **Carregar molécula e iniciar AR**:
   - Selecione uma molécula
   - Clique em "Iniciar AR"
   - **Permita acesso à câmera** quando solicitado
   - Aponte para uma superfície plana
   - **Toque na tela** para posicionar a molécula

### 🧪 Testar Compatibilidade AR

Abra `teste-webxr.html` no seu smartphone para verificar se seu dispositivo suporta AR:

```
http://localhost:8000/teste-webxr.html
```

## 🔧 Solução de Problemas

## 🏗️ Estrutura do Projeto

```
moleculas/
├── index.html              # Visualizador com AR (WebXR)
├── index-ar-simple.html    # Alternativa AR (A-Frame)
├── teste-webxr.html        # Teste de compatibilidade AR
├── iniciar-servidor.bat    # Script para iniciar servidor local
├── js/
│   ├── pdbParser.js        # Parser de arquivos PDB
│   ├── moleculeRenderer.js # Renderização 3D das moléculas
│   ├── sceneManager.js     # Gerenciamento da cena Three.js
│   ├── arSceneManager.js   # Gerenciamento AR (WebXR)
│   └── fileLoader.js       # Carregamento de arquivos
├── pdb/                    # Moléculas disponíveis
│   ├── butanol.pdb
│   ├── atp.pdb
│   ├── diamond.pdb
│   └── ...
├── README.md               # Este arquivo
├── TROUBLESHOOTING_AR.md   # Guia de solução de problemas AR
└── docs/                   # Documentação técnica
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

### 5. **arSceneManager.js** ✨ NOVO

Gerencia a experiência de Realidade Aumentada.

**Funções principais:**

- `initARScene(pdbData, moleculeName)` - Inicializa sessão WebXR AR
- `stopARScene()` - Encerra sessão AR
- `createMoleculeInGroup(atoms, connections, group)` - Renderiza molécula para AR
- `updateARStatus(text, state)` - Atualiza status da AR na interface

**Características:**

- Usa WebXR Device API
- Hit-testing para posicionamento (toque na tela)
- Escala apropriada para AR
- Rotação automática da molécula
- Tratamento de permissões de câmera

## 🔑 Diferenças entre Versões

| Recurso | `index.html` | `index-ar-simple.html` |
|---------|--------------|------------------------|
| Tecnologia | WebXR + Three.js | AR.js + A-Frame |
| Marcadores | Não precisa | Não precisa |
| Compatibilidade | Smartphones modernos | Mais ampla |
| Posicionamento | Toque na tela | Toque na tela |
| Qualidade | Alta | Média |
| Performance | Melhor | Boa |
| Requisitos | HTTPS | HTTPS |

**Recomendação:** Use `index.html` primeiro. Se não funcionar, tente `index-ar-simple.html`.

## � Solução de Problemas

### ❌ "Navegador não tem acesso à câmera"

Consulte o guia completo: **[TROUBLESHOOTING_AR.md](./TROUBLESHOOTING_AR.md)**

**Soluções rápidas:**

1. **Permitir acesso à câmera**:
   - Clique no ícone 🔒 na barra de endereços
   - Selecione "Permitir" para Câmera
   - Recarregue a página

2. **Usar HTTPS ou localhost**:
   - WebXR só funciona em conexões seguras
   - Use `localhost` ou `https://`

3. **Verificar dispositivo compatível**:
   - AR só funciona em smartphones
   - Teste em: `teste-webxr.html`

4. **Usar versão alternativa**:
   - Se WebXR não funcionar, use `index-ar-simple.html`

### 📱 AR não inicia?

- ✅ Está usando Chrome/Edge/Safari em smartphone?
- ✅ Permitiu acesso à câmera?
- ✅ Está usando HTTPS ou localhost?
- ✅ O ambiente está bem iluminado?

## 🏗️ Estrutura do Projeto

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
- **WebXR Device API** - Realidade Aumentada nativa do navegador
- **OrbitControls** - Controles de câmera para 3D
- **A-Frame** (alternativa) - Framework AR simplificado
- **AR.js** (alternativa) - Biblioteca AR baseada em marcadores
- **JavaScript ES6** - Módulos e funcionalidades modernas

## 📚 Recursos Adicionais

- **WebXR Samples**: https://immersive-web.github.io/webxr-samples/
- **Three.js Docs**: https://threejs.org/docs/
- **PDB Format**: https://www.wwpdb.org/documentation/file-format
- **CPK Colors**: https://en.wikipedia.org/wiki/CPK_coloring

## 🎓 Uso Educacional

Este projeto é ideal para:

- Ensino de química e bioquímica
- Visualização de estruturas moleculares
- Demonstrações em sala de aula
- Estudos de estruturas proteicas
- Aprendizado de WebXR e Three.js

## 📄 Licença

Este projeto é de uso educacional e científico.

## 🤝 Contribuindo

Melhorias são bem-vindas! Áreas de interesse:

- Suporte a mais formatos (MOL, MOL2, CIF)
- Modos de visualização (esfera-bastão, superfície)
- Exportação de imagens/vídeos
- Análise de propriedades moleculares
- Melhor compatibilidade AR em mais dispositivos
