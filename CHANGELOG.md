# Changelog

Todos os mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/),
e este projeto adere ao [Semantic Versioning](https://semver.org/lang/pt-BR/).

---

## [2.0.0] - 2024-10-02

### ✨ Adicionado

- **Arquitetura modular**: Refatoração completa separando o código em módulos independentes
  - `pdbParser.js`: Parser dedicado para arquivos PDB
  - `moleculeRenderer.js`: Renderização 3D isolada
  - `sceneManager.js`: Gerenciamento centralizado da cena Three.js
  - `fileLoader.js`: Carregamento e manipulação de arquivos

- **Sistema híbrido de ligações**:
  - Usa dados CONECT quando disponíveis no arquivo PDB
  - Cálculo automático por distância quando CONECT ausente
  - Baseado em raios covalentes tabelados

- **Detecção inteligente de elementos**:
  - Suporte para elementos de 1 e 2 letras
  - Múltiplas estratégias de extração (colunas 77-78 e 13-16)
  - Validação de elementos químicos conhecidos

- **Centralização automática**:
  - Molécula automaticamente centralizada ao carregar
  - Câmera ajustada para enquadrar toda a molécula
  - Distância calculada dinamicamente

- **Interatividade aprimorada**:
  - Clique em átomos para ver informações
  - Sistema de raycasting para detecção precisa
  - Popup com dados do elemento

- **Biblioteca de moléculas expandida**:
  - Adicionados: álcoois (metanol a decanol)
  - Adicionados: ATP, diamante, heroína, NaCl
  - Total: 14 moléculas de exemplo

### 🔧 Modificado

- **Interface do usuário**:
  - Design mais limpo e moderno
  - Separação clara entre "Moléculas do Projeto" e "Carregar do Computador"
  - Feedback visual ao carregar moléculas
  - Nome da molécula exibido em destaque

- **Cores CPK expandidas**:
  - Adicionados mais elementos químicos
  - Cores padronizadas segundo convenção CPK
  - Cor padrão (cinza) para elementos desconhecidos

- **Renderização de ligações**:
  - Cilindros mais finos (raio 0.15 → 0.2)
  - Cor uniforme (cinza claro)
  - Orientação precisa usando quaternions

### 🐛 Corrigido

- **Parsing de elementos**:
  - Correção na extração de elementos de 2 letras (ex: Fe, Ca, Cl)
  - Tratamento de nomes com números (ex: "1CA" → "CA")
  - Validação contra lista conhecida de elementos

- **Criação de ligações**:
  - Evita ligações duplicadas
  - Validação de existência de átomos antes de criar bonds
  - Cálculo correto de distâncias em 3D

- **Performance**:
  - Limpeza adequada de geometrias e materiais ao trocar moléculas
  - Prevenção de memory leaks
  - Renderização otimizada

### 📝 Documentação

- README.md atualizado com nova estrutura
- Comentários detalhados em todos os módulos
- Descrição de cada função e sua responsabilidade

---

## [1.0.0] - 2024-09-15

### ✨ Inicial

- **Implementação monolítica** (arquivo único `a.html`)
- **Funcionalidades básicas**:
  - Leitura de arquivos PDB
  - Renderização 3D com Three.js
  - Controles de órbita
  - Cores CPK básicas

- **Moléculas de exemplo**:
  - Aspirina
  - Cafeína
  - NaCl (sal)

- **Renderização**:
  - Átomos como esferas
  - Ligações como cilindros
  - Iluminação básica

- **Interação**:
  - Rotação com mouse
  - Zoom com scroll
  - Upload de arquivos PDB

### 🔧 Configuração

- Three.js r128 via CDN
- OrbitControls para navegação 3D
- FileReader API para upload

---

## [Unreleased] - Planejado

### 🚀 Funcionalidades Futuras

- **Múltiplos estilos de visualização**:
  - [ ] Ball-and-stick (bolas e palitos)
  - [ ] Space-filling (preenchimento espacial)
  - [ ] Wireframe (apenas ligações)
  - [ ] Ribbon (fitas para proteínas)

- **Análise química**:
  - [ ] Medição de distâncias entre átomos
  - [ ] Medição de ângulos
  - [ ] Cálculo de ângulos diedrais
  - [ ] Identificação de grupos funcionais

- **Exportação**:
  - [ ] Salvar screenshots (PNG/JPG)
  - [ ] Exportar cena 3D (OBJ/STL)
  - [ ] Gerar relatório PDF

- **Animações**:
  - [ ] Transições suaves ao trocar moléculas
  - [ ] Rotação automática (opcional)
  - [ ] Animação de vibração molecular
  - [ ] Trajetórias de dinâmica molecular

- **Suporte a mais formatos**:
  - [ ] MOL/MOL2
  - [ ] XYZ
  - [ ] CIF
  - [ ] SDF

- **Performance**:
  - [ ] Object pooling para reutilização
  - [ ] Web Workers para parsing
  - [ ] LOD (Level of Detail)
  - [ ] Instancing para moléculas grandes

- **Seleção avançada**:
  - [ ] Seleção múltipla de átomos
  - [ ] Seleção por tipo de elemento
  - [ ] Seleção de resíduos (proteínas)
  - [ ] Highlight de seleção

- **Informações adicionais**:
  - [ ] Painel de propriedades da molécula
  - [ ] Fórmula molecular
  - [ ] Massa molar
  - [ ] Estatísticas (número de átomos, ligações)

- **Interface**:
  - [ ] Modo escuro/claro
  - [ ] Temas de cores customizáveis
  - [ ] Painel lateral recolhível
  - [ ] Atalhos de teclado

- **Comparação**:
  - [ ] Carregar múltiplas moléculas
  - [ ] Sobrepor estruturas
  - [ ] Alinhamento estrutural
  - [ ] Comparação side-by-side

### 🔧 Melhorias Técnicas Planejadas

- [ ] Testes unitários (Jest)
- [ ] Testes E2E (Playwright)
- [ ] Build system (Vite/Webpack)
- [ ] TypeScript migration
- [ ] ESLint + Prettier
- [ ] CI/CD com GitHub Actions
- [ ] Hospedagem (GitHub Pages)
- [ ] PWA (Progressive Web App)

---

## Notas de Versão

### Sobre Versionamento

- **Major (X.0.0)**: Mudanças incompatíveis na API
- **Minor (x.Y.0)**: Novas funcionalidades compatíveis
- **Patch (x.y.Z)**: Correções de bugs

### Sobre Tags

- ✨ **Adicionado**: Novas funcionalidades
- 🔧 **Modificado**: Mudanças em funcionalidades existentes
- 🐛 **Corrigido**: Correções de bugs
- 🗑️ **Removido**: Funcionalidades removidas
- 🔒 **Segurança**: Correções de vulnerabilidades
- 📝 **Documentação**: Mudanças apenas em documentação
- 🚀 **Performance**: Melhorias de performance

---

## Histórico Detalhado de Desenvolvimento

### Fase 1: Protótipo (Setembro 2024)

**Objetivo**: Criar um visualizador funcional básico

**Realizações**:
- Implementação monolítica em arquivo único
- Leitura básica de PDB
- Renderização simples com Three.js
- Controles de câmera

**Desafios**:
- Código difícil de manter
- Detecção de elementos inconsistente
- Ligações nem sempre criadas corretamente

### Fase 2: Refatoração Modular (Outubro 2024)

**Objetivo**: Melhorar manutenibilidade e extensibilidade

**Realizações**:
- Separação em 4 módulos independentes
- Sistema híbrido de ligações
- Detecção inteligente de elementos
- Centralização automática

**Benefícios**:
- Código mais limpo e organizado
- Facilita adição de novos formatos
- Testes mais fáceis de implementar
- Melhor performance

**Aprendizados**:
- Importância de separation of concerns
- Value de ter um bom sistema de parsing
- Necessidade de fallbacks (CONECT vs. distância)

### Fase 3: Planejamento Futuro (A partir de Outubro 2024)

**Próximos Passos**:
1. Implementar testes automatizados
2. Adicionar mais estilos de visualização
3. Suporte a mais formatos de arquivo
4. Melhorias de performance para moléculas grandes
5. Deploy e documentação completa

---

## Contribuições

Veja [CONTRIBUTING.md](CONTRIBUTING.md) para saber como contribuir com o projeto.

---

## Licença

Este projeto está sob licença MIT. Veja LICENSE para mais detalhes.

---

## Agradecimentos

- **Three.js Team**: Pela excelente biblioteca 3D
- **Protein Data Bank**: Pelo formato PDB e dados moleculares
- **CPK Color Scheme**: Por estabelecer o padrão de cores
- **Comunidade WebGL**: Pela documentação e exemplos
