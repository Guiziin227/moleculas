# Script para iniciar servidor e mostrar instruções
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Visualizador AR de Moléculas - Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar Python
Write-Host "[1/3] Verificando Python..." -ForegroundColor Yellow
try {
    $pythonVersion = python --version 2>&1
    Write-Host "  ✓ $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "  ✗ Python não encontrado!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor, instale Python:" -ForegroundColor Yellow
    Write-Host "https://www.python.org/downloads/" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Pressione qualquer tecla para sair..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit
}

# Obter IP do computador
Write-Host ""
Write-Host "[2/3] Obtendo endereço IP..." -ForegroundColor Yellow
$ipAddress = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object {$_.InterfaceAlias -notlike "*Loopback*" -and $_.IPAddress -notlike "169.254.*"} | Select-Object -First 1).IPAddress

if ($ipAddress) {
    Write-Host "  ✓ IP encontrado: $ipAddress" -ForegroundColor Green
} else {
    Write-Host "  ⚠ Não foi possível detectar IP automaticamente" -ForegroundColor Yellow
    $ipAddress = "SEU_IP_AQUI"
}

# Verificar firewall
Write-Host ""
Write-Host "[3/3] Verificando firewall..." -ForegroundColor Yellow
$firewallRule = Get-NetFirewallRule -DisplayName "Python HTTP Server*" -ErrorAction SilentlyContinue

if ($firewallRule) {
    Write-Host "  ✓ Regra de firewall já existe" -ForegroundColor Green
} else {
    Write-Host "  ⚠ Regra de firewall não encontrada" -ForegroundColor Yellow
    Write-Host "    Se tiver problemas de conexão, execute como Administrador" -ForegroundColor Gray
}

# Mostrar instruções
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  INSTRUÇÕES PARA USO NO SMARTPHONE" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Conecte seu smartphone na MESMA REDE Wi-Fi" -ForegroundColor White
Write-Host ""
Write-Host "2. No smartphone, abra o navegador e acesse:" -ForegroundColor White
Write-Host ""
Write-Host "   http://${ipAddress}:8000" -ForegroundColor Green -BackgroundColor Black
Write-Host ""
Write-Host "3. Para testar compatibilidade AR:" -ForegroundColor White
Write-Host "   http://${ipAddress}:8000/teste-webxr.html" -ForegroundColor Yellow
Write-Host ""
Write-Host "4. Versão alternativa (se a principal não funcionar):" -ForegroundColor White
Write-Host "   http://${ipAddress}:8000/index-ar-simple.html" -ForegroundColor Yellow
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Perguntar se quer continuar
Write-Host "Deseja iniciar o servidor agora? (S/N): " -NoNewline -ForegroundColor Yellow
$response = Read-Host

if ($response -eq "S" -or $response -eq "s" -or $response -eq "Y" -or $response -eq "y" -or $response -eq "") {
    Write-Host ""
    Write-Host "Iniciando servidor na porta 8000..." -ForegroundColor Green
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  SERVIDOR RODANDO!" -ForegroundColor Green
    Write-Host "  Acesse: http://${ipAddress}:8000" -ForegroundColor Green
    Write-Host "  Pressione Ctrl+C para parar" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    
    # Iniciar servidor
    python -m http.server 8000
} else {
    Write-Host ""
    Write-Host "Servidor não iniciado. Execute novamente quando estiver pronto." -ForegroundColor Yellow
    Write-Host ""
}

Write-Host ""
Write-Host "Pressione qualquer tecla para sair..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
