# Guia de Uso do MindAR com Moléculas 3D

## 🎯 O que foi implementado

Integrei o **MindAR** (biblioteca de Realidade Aumentada) com **Three.js** no seu projeto de visualização de moléculas. Agora você pode visualizar moléculas em 3D sobre superfícies reais usando a câmera do seu dispositivo!

## 📁 Arquivos Criados

1. **index-ar.html** - Interface AR do visualizador de moléculas
2. **js/arSceneManager.js** - Gerenciador da cena AR
3. **AR_GUIDE.md** - Este guia

## 🚀 Como Usar

### Passo 1: Gerar o arquivo de marcadores (targets.mind)

O MindAR precisa de um arquivo `.mind` que contém os marcadores de imagem para rastrear. Eu criei um marcador de exemplo para você (`marker.svg`).

1.  **Acesse o Compilador Online:** Vá para [https://hiukim.github.io/mind-ar-js-doc/tools/compile](https://hiukim.github.io/mind-ar-js-doc/tools/compile).
2.  **Faça o Upload:** Envie o arquivo `marker.svg` localizado na raiz do seu projeto. Você também pode usar qualquer outra imagem com bom contraste.
3.  **Compile:** Clique em "Start" e aguarde a compilação terminar.
4.  **Faça o Download:** Baixe o arquivo `targets.mind` gerado.
5.  **Posicione o Arquivo:** Coloque o arquivo `targets.mind` na raiz do projeto: `C:\Users\Laboratorio\WebstormProjects\moleculas\targets.mind`.

### Passo 2: Iniciar um servidor local

O MindAR precisa ser executado em um servidor HTTP (não funciona abrindo o arquivo diretamente):

```bash
# Opção 1: Usando Python (se instalado)
python -m http.server 8000

# Opção 2: Usando Node.js
npx http-server -p 8000

# Opção 3: Usando Live Server no VS Code/WebStorm
# Clique com botão direito em index-ar.html > Open with Live Server
```

### Passo 3: Acessar a aplicação

1. Abra o navegador e acesse: `http://localhost:8000/index-ar.html`
2. Selecione uma molécula da lista ou carregue um arquivo PDB
3. Clique em "Iniciar AR"
4. Permita acesso à câmera quando solicitado
5. Aponte a câmera para o marcador de imagem
6. A molécula aparecerá em 3D sobre o marcador!

## 🎨 Recursos da Versão AR

- ✅ Visualização de moléculas em Realidade Aumentada
- ✅ Rotação automática suave da molécula
- ✅ Detecção de marcador em tempo real
- ✅ Status visual do rastreamento AR
- ✅ Todas as moléculas do projeto disponíveis
- ✅ Suporte para carregar arquivos PDB externos
- ✅ Interface otimizada para mobile e desktop
- ✅ Botão para mostrar/ocultar menu

## 📱 Compatibilidade

- ✅ Chrome/Edge (Desktop e Mobile)
- ✅ Safari (iOS 11+)
- ✅ Firefox (Desktop e Mobile)
- ⚠️ Requer HTTPS ou localhost
- ⚠️ Requer permissão de câmera

## 🔧 Configurações Avançadas

### Ajustar tamanho da molécula em AR
No arquivo `js/arSceneManager.js`, linha ~75:
```javascript
const targetSize = 0.5; // Altere este valor (em metros)
```

### Ajustar velocidade de rotação
No arquivo `js/arSceneManager.js`, linha ~81:
```javascript
moleculeGroup.userData.rotationSpeed = 0.3; // Altere este valor
```

### Desabilitar rotação automática
No arquivo `js/arSceneManager.js`, linha ~109:
```javascript
// Comente esta linha:
// moleculeGroup.rotation.y += 0.01 * moleculeGroup.userData.rotationSpeed;
```

## 🆚 Comparação: Versão Normal vs AR

| Recurso | index.html | index-ar.html |
|---------|-----------|---------------|
| Visualização 3D | ✅ | ✅ |
| Controles de órbita | ✅ | ❌ |
| Realidade Aumentada | ❌ | ✅ |
| Funciona offline | ✅ | ❌* |
| Requer câmera | ❌ | ✅ |

*Requer servidor local

## 🐛 Solução de Problemas

### "AR não inicia"
- Verifique se está usando HTTPS ou localhost
- Verifique se permitiu acesso à câmera
- Verifique se o arquivo `targets.mind` existe

### "Marcador não detecta"
- Use uma imagem com bons detalhes/contraste
- Ilumine bem a imagem
- Mantenha a câmera estável
- Certifique-se que a imagem está plana

### "Molécula muito grande/pequena"
- Ajuste o valor `targetSize` em `arSceneManager.js`

### "Erro ao carregar arquivo PDB externo"
- Este é o problema que você mencionou! A solução está na normalização de encoding.
- O arquivo `fileLoader.js` já tem tratamento para isso.

## 📚 Documentação MindAR

- Site oficial: https://hiukim.github.io/mind-ar-js-doc/
- Exemplos: https://github.com/hiukim/mind-ar-js
- Compiler de marcadores: https://hiukim.github.io/mind-ar-js-doc/tools/compile

## 🎓 Próximos Passos

1. Crie marcadores personalizados para suas moléculas
2. Adicione interações touch (pinch to zoom, rotate)
3. Implemente múltiplos marcadores (uma molécula por marcador)
4. Adicione animações de transição
5. Crie um modo "portal" onde você pode "entrar" na molécula

---

**Desenvolvido com ❤️ usando MindAR + Three.js**
