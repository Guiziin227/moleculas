# 🔧 Solução de Problemas - AR (Realidade Aumentada)

## ❌ Problema: Navegador não tem acesso à câmera

### Soluções:

### 1. **Verificar Permissões do Navegador**

#### Chrome/Edge (Android):
1. Clique no ícone de **cadeado** 🔒 ou **ⓘ** na barra de endereços
2. Encontre **"Câmera"**
3. Selecione **"Permitir"**
4. Recarregue a página (F5)

#### Chrome/Edge (iOS):
1. Vá em **Ajustes** do iOS
2. Role até **Chrome** ou **Edge**
3. Ative **"Câmera"**
4. Recarregue a página

#### Safari (iOS):
1. Vá em **Ajustes** → **Safari**
2. Em **Ajustes de Sites**, ative **"Câmera"**
3. Recarregue a página

### 2. **Usar HTTPS (Obrigatório para WebXR)**

WebXR AR **só funciona** em:
- `https://` (site seguro)
- `localhost` (desenvolvimento local)

**Como testar localmente:**

```bash
# Opção 1: Python
python -m http.server 8000

# Opção 2: Node.js (http-server)
npx http-server -p 8000

# Opção 3: PHP
php -S localhost:8000
```

Depois acesse: `http://localhost:8000`

### 3. **Requisitos do Dispositivo**

✅ **Funciona:**
- Android 8+ com Chrome/Edge
- iOS 12+ com Safari/Chrome/Edge
- Dispositivos com sensor ARCore (Android) ou ARKit (iOS)

❌ **Não funciona:**
- Computadores desktop (sem WebXR AR)
- Navegadores antigos
- Dispositivos sem sensores AR

### 4. **Testar Suporte WebXR**

Acesse no seu dispositivo móvel:
```
https://immersive-web.github.io/webxr-samples/
```

Se os exemplos funcionarem, seu dispositivo suporta AR!

### 5. **Alternativa: Usar versão simples com A-Frame**

Se WebXR não funcionar, use o arquivo alternativo:
```
index-ar-simple.html
```

Este usa **AR.js + A-Frame** que tem maior compatibilidade.

## 🐛 Mensagens de Erro Comuns

### "WebXR não é suportado neste navegador"
**Solução:** Use Chrome ou Edge em um dispositivo móvel Android/iOS

### "AR não é suportado neste dispositivo"
**Solução:** Seu dispositivo não tem sensores AR. Use o visualizador 3D normal.

### "SecurityError: Permission denied"
**Solução:** 
1. Limpe cache e cookies do site
2. Recarregue e permita acesso à câmera novamente
3. Verifique se está usando HTTPS

### "Cannot read properties of null"
**Solução:** Aguarde alguns segundos após carregar a molécula antes de iniciar AR

## 💡 Dicas

- **Ilumine bem o ambiente** - AR precisa de boa iluminação
- **Aponte para superfície plana** - Mesa, chão, parede
- **Mova devagar** - Dê tempo para o dispositivo mapear o ambiente
- **Toque na tela** - A molécula só aparece após tocar onde quer posicionar

## 📞 Ainda com problemas?

1. Verifique o console do navegador (F12) para ver erros específicos
2. Teste em outro dispositivo
3. Use a versão `index-ar-simple.html` como alternativa
4. Consulte a documentação: https://immersiveweb.dev/

## 🔄 Mudanças Recentes

A aplicação foi atualizada de **MindAR** (que requer marcadores impressos) para **WebXR** (sem marcadores).

**Vantagens:**
- ✅ Não precisa imprimir marcadores
- ✅ Posiciona tocando na tela
- ✅ Usa API nativa do navegador

**Desvantagens:**
- ❌ Só funciona em dispositivos móveis
- ❌ Requer navegadores modernos
- ❌ Precisa de HTTPS (exceto localhost)
