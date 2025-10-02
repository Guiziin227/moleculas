# Guia de Contribuição

Obrigado por considerar contribuir com o Visualizador de Moléculas PDB! Este documento fornece diretrizes e boas práticas para contribuir com o projeto.

---

## 📋 Índice

1. [Código de Conduta](#código-de-conduta)
2. [Como Posso Contribuir?](#como-posso-contribuir)
3. [Configuração do Ambiente](#configuração-do-ambiente)
4. [Processo de Desenvolvimento](#processo-de-desenvolvimento)
5. [Padrões de Código](#padrões-de-código)
6. [Testes](#testes)
7. [Documentação](#documentação)
8. [Processo de Pull Request](#processo-de-pull-request)

---

## Código de Conduta

### Nosso Compromisso

Estamos comprometidos em fornecer um ambiente acolhedor e livre de assédio para todos, independentemente de:
- Idade, tamanho corporal, deficiência
- Etnia, identidade e expressão de gênero
- Nível de experiência, nacionalidade
- Aparência pessoal, raça, religião
- Identidade e orientação sexual

### Comportamento Esperado

- Use linguagem acolhedora e inclusiva
- Respeite diferentes pontos de vista e experiências
- Aceite críticas construtivas graciosamente
- Foque no que é melhor para a comunidade
- Mostre empatia com outros membros

### Comportamento Inaceitável

- Uso de linguagem ou imagens sexualizadas
- Comentários insultuosos/depreciativos e ataques pessoais
- Assédio público ou privado
- Publicar informações privadas de terceiros
- Outras condutas consideradas inapropriadas

---

## Como Posso Contribuir?

### 🐛 Reportar Bugs

Bugs são rastreados como [GitHub issues](../../issues). Antes de criar um issue:

1. **Verifique se o bug já foi reportado** procurando nos issues existentes
2. **Determine qual módulo está causando o problema**
3. **Colete informações relevantes**:
   - Navegador e versão
   - Sistema operacional
   - Arquivo PDB problemático (se aplicável)
   - Mensagens de erro

**Template para reportar bug:**

```markdown
**Descrição do Bug**
Uma descrição clara e concisa do bug.

**Passos para Reproduzir**
1. Vá para '...'
2. Clique em '...'
3. Role até '...'
4. Veja o erro

**Comportamento Esperado**
Descrição do que deveria acontecer.

**Comportamento Atual**
Descrição do que está acontecendo.

**Screenshots**
Se aplicável, adicione screenshots.

**Ambiente**
- Navegador: [ex: Chrome 118]
- OS: [ex: Windows 11]
- Versão do projeto: [ex: 2.0.0]

**Contexto Adicional**
Qualquer outra informação relevante.
```

### ✨ Sugerir Melhorias

Sugestões são bem-vindas! Antes de sugerir:

1. **Verifique se já não foi sugerido**
2. **Determine se a melhoria se encaixa no escopo do projeto**
3. **Forneça detalhes e contexto**

**Template para sugestão:**

```markdown
**Descrição da Melhoria**
Uma descrição clara da funcionalidade desejada.

**Motivação**
Por que esta melhoria seria útil? Que problema resolve?

**Solução Proposta**
Descrição de como você imagina que funcione.

**Alternativas Consideradas**
Outras abordagens que você pensou.

**Contexto Adicional**
Screenshots, mockups, exemplos, etc.
```

### 🔧 Contribuir com Código

Tipos de contribuições aceitas:

- **Correção de bugs**
- **Novas funcionalidades** (discuta primeiro em um issue)
- **Melhorias de performance**
- **Refatoração de código**
- **Testes**
- **Documentação**

---

## Configuração do Ambiente

### Pré-requisitos

- Navegador moderno (Chrome, Firefox, Safari, Edge)
- Editor de código (recomendado: VS Code)
- Git instalado
- Conhecimento de JavaScript ES6+
- Conhecimento básico de Three.js

### Configuração Inicial

1. **Fork o repositório**

   Clique no botão "Fork" no GitHub

2. **Clone seu fork**

   ```bash
   git clone https://github.com/SEU_USUARIO/moleculas.git
   cd moleculas
   ```

3. **Adicione o repositório upstream**

   ```bash
   git remote add upstream https://github.com/Guiziin227/moleculas.git
   ```

4. **Abra o projeto**

   Simplesmente abra `index.html` no navegador ou use um servidor local:

   ```bash
   # Python 3
   python -m http.server 8000

   # Node.js (http-server)
   npx http-server
   ```

5. **Acesse no navegador**

   ```
   http://localhost:8000
   ```

### Estrutura do Projeto

```
moleculas/
├── index.html              # Arquivo principal
├── style.css              # Estilos (se separado)
├── js/
│   ├── pdbParser.js       # Parser de PDB
│   ├── moleculeRenderer.js # Renderização 3D
│   ├── sceneManager.js    # Gerenciamento da cena
│   └── fileLoader.js      # Carregamento de arquivos
├── pdb/                   # Moléculas de exemplo
├── docs/                  # Documentação adicional
├── README.md              # Visão geral
├── ARCHITECTURE.md        # Arquitetura detalhada
├── API.md                 # Documentação da API
├── CHANGELOG.md           # Histórico de mudanças
└── CONTRIBUTING.md        # Este arquivo
```

---

## Processo de Desenvolvimento

### Workflow Git

1. **Crie um branch para sua feature/fix**

   ```bash
   git checkout -b feature/nome-da-feature
   # ou
   git checkout -b fix/nome-do-bug
   ```

2. **Faça suas mudanças**

   - Escreva código limpo e comentado
   - Siga os padrões de código (veja abaixo)
   - Teste suas mudanças

3. **Commit suas mudanças**

   ```bash
   git add .
   git commit -m "feat: adiciona visualização space-filling"
   ```

   Use [Conventional Commits](https://www.conventionalcommits.org/):
   - `feat:` nova funcionalidade
   - `fix:` correção de bug
   - `docs:` mudanças em documentação
   - `style:` formatação, ponto-vírgula, etc
   - `refactor:` refatoração de código
   - `perf:` melhoria de performance
   - `test:` adição de testes
   - `chore:` atualização de dependências, etc

4. **Mantenha seu branch atualizado**

   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

5. **Push para seu fork**

   ```bash
   git push origin feature/nome-da-feature
   ```

---

## Padrões de Código

### JavaScript

#### Nomenclatura

```javascript
// Variáveis e funções: camelCase
const atomColor = getAtomColor(element);

// Constantes: UPPER_SNAKE_CASE
const MAX_BOND_LENGTH = 2.0;
const CPK_COLORS = { ... };

// Classes (se usar): PascalCase
class MoleculeParser { ... }

// Arquivos: camelCase.js
// pdbParser.js, moleculeRenderer.js
```

#### Estilo de Código

```javascript
// Use const para valores que não mudam
const PI = 3.14159;

// Use let para valores que mudam
let atomCount = 0;

// Evite var
// ❌ var x = 10;
// ✅ let x = 10;

// Arrow functions para callbacks
atoms.forEach((atom) => {
  console.log(atom.element);
});

// Destructuring quando apropriado
const { atoms, connections } = parsePDB(data);

// Template strings
console.log(`Molécula com ${atoms.length} átomos`);

// Spread operator
const newAtoms = [...atoms, newAtom];

// Comentários JSDoc para funções públicas
/**
 * Cria uma molécula 3D
 * @param {Array<Atom>} atoms - Array de átomos
 * @param {Array<Connection>} connections - Conexões
 * @param {THREE.Scene} scene - Cena Three.js
 * @returns {THREE.Group} Grupo com a molécula
 */
function createMolecule(atoms, connections, scene) {
  // ...
}
```

#### Organização de Código

```javascript
// 1. Comentário de cabeçalho
/**
 * nomeDoArquivo.js
 * Descrição do módulo
 */

// 2. Constantes
const CONSTANTE_1 = valor;
const CONSTANTE_2 = valor;

// 3. Funções auxiliares privadas
function _helperFunction() {
  // ...
}

// 4. Funções públicas
function publicFunction() {
  // ...
}

// 5. Event listeners / Inicialização
document.addEventListener("DOMContentLoaded", () => {
  // ...
});
```

### HTML

```html
<!-- Indentação: 2 espaços -->
<div class="container">
  <div class="item">
    <p>Conteúdo</p>
  </div>
</div>

<!-- Atributos entre aspas duplas -->
<button id="loadButton" class="btn-primary">Carregar</button>

<!-- Semântica HTML5 -->
<header>
  <nav>...</nav>
</header>
<main>
  <section>...</section>
</main>
<footer>...</footer>
```

### CSS

```css
/* Organização: propriedades alfabéticas */
.button {
  background: #4caf50;
  border: none;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  padding: 10px 20px;
}

/* Use classes, evite IDs para estilos */
/* ❌ */ #button { ... }
/* ✅ */ .button { ... }

/* Nomenclatura: kebab-case */
.file-selector { ... }
.load-button { ... }
```

---

## Testes

### Testes Manuais

Antes de enviar um PR, teste:

1. **Carregamento de moléculas**
   - ✓ Carregar moléculas do projeto
   - ✓ Upload de arquivo do computador
   - ✓ Mensagens de erro para arquivos inválidos

2. **Renderização**
   - ✓ Átomos aparecem corretamente
   - ✓ Ligações criadas (CONECT e automático)
   - ✓ Cores CPK corretas
   - ✓ Centralização automática

3. **Interação**
   - ✓ Rotação com mouse
   - ✓ Zoom com scroll
   - ✓ Clique em átomos exibe informações
   - ✓ Botão limpar funciona

4. **Responsividade**
   - ✓ Redimensionar janela
   - ✓ Diferentes resoluções

5. **Navegadores**
   - ✓ Chrome
   - ✓ Firefox
   - ✓ Safari
   - ✓ Edge

### Testes Automatizados (Futuro)

Planejamos implementar:
- Unit tests com Jest
- E2E tests com Playwright
- Visual regression tests

---

## Documentação

### Comentários no Código

```javascript
// ❌ Comentário óbvio
let i = 0; // inicializa i com 0

// ✅ Comentário útil
let i = 0; // índice do átomo atual no loop de rendering

// ✅ JSDoc para funções públicas
/**
 * Calcula a distância entre dois átomos
 * @param {Atom} atom1 - Primeiro átomo
 * @param {Atom} atom2 - Segundo átomo
 * @returns {number} Distância em Angstroms
 */
function calculateDistance(atom1, atom2) {
  const dx = atom2.x - atom1.x;
  const dy = atom2.y - atom1.y;
  const dz = atom2.z - atom1.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}
```

### Atualizar Documentação

Ao adicionar funcionalidades, atualize:

- **README.md**: Se mudar uso básico
- **API.md**: Se adicionar/modificar funções públicas
- **ARCHITECTURE.md**: Se mudar arquitetura
- **CHANGELOG.md**: Sempre! Documente suas mudanças

---

## Processo de Pull Request

### Checklist Antes de Enviar

- [ ] Código segue os padrões do projeto
- [ ] Comentários adicionados onde necessário
- [ ] Documentação atualizada
- [ ] Testado em múltiplos navegadores
- [ ] Sem erros no console
- [ ] Commits seguem Conventional Commits
- [ ] Branch atualizado com upstream/main

### Criar Pull Request

1. **Vá para seu fork no GitHub**

2. **Clique em "New Pull Request"**

3. **Preencha o template**

```markdown
## Descrição

Breve descrição das mudanças.

## Tipo de Mudança

- [ ] Bug fix
- [ ] Nova funcionalidade
- [ ] Breaking change
- [ ] Documentação

## Como Testar

1. Passo 1
2. Passo 2
3. Passo 3

## Checklist

- [ ] Código segue padrões do projeto
- [ ] Testado em Chrome, Firefox, Safari
- [ ] Documentação atualizada
- [ ] CHANGELOG.md atualizado
- [ ] Sem warnings no console

## Screenshots (se aplicável)

![Antes](url)
![Depois](url)
```

4. **Aguarde revisão**

   - Mantenedor irá revisar
   - Pode pedir mudanças
   - Discussão construtiva é encorajada

5. **Faça ajustes se solicitado**

   ```bash
   # Faça as mudanças
   git add .
   git commit -m "fix: ajusta conforme revisão"
   git push origin feature/nome-da-feature
   ```

6. **Merge**

   Após aprovação, seu PR será merged! 🎉

---

## Áreas que Precisam de Ajuda

### Prioridade Alta

- [ ] Testes automatizados
- [ ] Suporte a formato MOL2
- [ ] Visualização space-filling
- [ ] Performance para moléculas grandes (>5000 átomos)

### Prioridade Média

- [ ] Exportação de screenshots
- [ ] Medição de distâncias
- [ ] Modo escuro
- [ ] Animações de transição

### Prioridade Baixa

- [ ] PWA support
- [ ] Internacionalização (i18n)
- [ ] Temas customizáveis

---

## Dúvidas?

- **Documentação**: Leia README.md, ARCHITECTURE.md, API.md
- **Issues**: Procure em issues existentes
- **Discussões**: Use GitHub Discussions
- **Email**: [seu-email@exemplo.com] (se aplicável)

---

## Reconhecimento

Todos os contribuidores serão adicionados ao README.md e receberão crédito adequado por suas contribuições.

---

## Licença

Ao contribuir, você concorda que suas contribuições serão licenciadas sob a mesma licença do projeto (MIT).

---

**Obrigado por contribuir! 🙏**

Sua ajuda torna este projeto melhor para todos.
