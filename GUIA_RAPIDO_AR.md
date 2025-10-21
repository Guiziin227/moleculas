# 📱 Guia Rápido - AR de Moléculas

## ✅ Checklist Antes de Começar

- [ ] Smartphone Android 8+ ou iOS 12+
- [ ] Chrome, Edge ou Safari atualizado
- [ ] Conexão Wi-Fi (mesma rede do computador)
- [ ] Ambiente bem iluminado
- [ ] Permissões de câmera habilitadas

---

## 🚀 Passo a Passo (5 minutos)

### 1️⃣ Iniciar Servidor Local

**No computador:**

```powershell
# Windows: Clique duas vezes em
iniciar-servidor.bat

# Ou execute manualmente:
python -m http.server 8000
```

### 2️⃣ Descobrir IP do Computador

**No computador (PowerShell):**

```powershell
ipconfig
```

Procure por `IPv4 Address`, exemplo: `192.168.1.100`

### 3️⃣ Conectar Smartphone

**No smartphone:**

1. Conecte na **mesma rede Wi-Fi** do computador
2. Abra Chrome/Edge/Safari
3. Digite na barra de endereços:
   ```
   http://192.168.1.100:8000
   ```
   (Substitua pelo IP do seu computador)

### 4️⃣ Testar Compatibilidade

Primeiro, teste se seu smartphone suporta AR:

```
http://192.168.1.100:8000/teste-webxr.html
```

✅ **Tudo verde?** Continue!  
❌ **Algo vermelho?** Veja [TROUBLESHOOTING_AR.md](./TROUBLESHOOTING_AR.md)

### 5️⃣ Usar AR

1. Acesse `http://192.168.1.100:8000/index.html`
2. **Selecione uma molécula** (ex: Metanol, ATP)
3. Clique em **"🚀 Iniciar AR"**
4. **Permita acesso à câmera** (muito importante!)
5. Aponte para mesa/chão/parede
6. **Toque na tela** onde quer a molécula

---

## 🎯 Dicas de Uso

### Posicionamento
- ✅ Aponte para superfícies planas e texturizadas
- ✅ Ambiente bem iluminado
- ❌ Evite superfícies reflexivas/lisas demais
- ❌ Evite luz muito fraca

### Interação
- **Toque**: Posicionar molécula
- **Pinça (2 dedos)**: Aumentar/diminuir
- **Arraste**: Mover pela tela
- A molécula **roda automaticamente**

### Moléculas Recomendadas
- 🟢 **Iniciantes**: Metanol, Etanol (pequenas)
- 🟡 **Intermediário**: ATP, Butanol
- 🔴 **Avançado**: Heroína, Diamante (complexas)

---

## ❌ Problemas Comuns

### "Não consigo acessar pelo IP"

```powershell
# Verificar firewall do Windows
# Permitir Python na rede
```

### "Câmera não autorizada"

1. Chrome: ⚙️ → Configurações → Privacidade → Câmera
2. Remova bloqueios para `localhost` ou seu IP
3. Recarregue a página

### "AR não funciona"

**Opção 1:** Use versão alternativa
```
http://192.168.1.100:8000/index-ar-simple.html
```

**Opção 2:** Verifique compatibilidade em `teste-webxr.html`

### "Molécula não aparece"

- Você tocou na tela após iniciar AR?
- O ambiente está iluminado?
- Está apontando para uma superfície?

---

## 📸 Capturar Screenshots

### Android
- **Volume Baixo** + **Power** simultaneamente

### iOS
- **Volume Up** + **Power** simultaneamente
- Ou **Home** + **Power** (modelos antigos)

---

## 🔗 Acesso Rápido

| Página | URL |
|--------|-----|
| Visualizador Principal | `http://SEU_IP:8000/` |
| Teste de Compatibilidade | `http://SEU_IP:8000/teste-webxr.html` |
| Versão Alternativa | `http://SEU_IP:8000/index-ar-simple.html` |

---

## 💡 Próximos Passos

Após dominar o básico:

1. ✨ Carregue seus próprios arquivos PDB
2. 🧪 Teste moléculas complexas (proteínas)
3. 🎓 Use em apresentações educacionais
4. 📱 Compartilhe com colegas/alunos

---

## 📞 Precisa de Ajuda?

1. Leia: [TROUBLESHOOTING_AR.md](./TROUBLESHOOTING_AR.md)
2. Verifique o console do navegador (F12)
3. Teste em outro dispositivo
4. Use a versão 3D normal (sem AR)

---

**🎉 Pronto! Agora você pode visualizar moléculas em AR!**

*Última atualização: Outubro 2025*
