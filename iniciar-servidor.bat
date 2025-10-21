@echo off
echo ========================================
echo   Servidor Local para Visualizador AR
echo ========================================
echo.

REM Verificar se Python está instalado
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Python não encontrado!
    echo.
    echo Por favor, instale Python:
    echo https://www.python.org/downloads/
    echo.
    pause
    exit /b
)

echo [OK] Iniciando configuracao...
echo.

REM Tentar executar o script PowerShell com mais recursos
powershell -ExecutionPolicy Bypass -File "%~dp0iniciar-servidor.ps1"

REM Se o PowerShell falhar, usar método simples
if %errorlevel% neq 0 (
    echo.
    echo ========================================
    echo   Modo Simplificado
    echo ========================================
    echo.
    echo Servidor iniciando na porta 8000...
    echo.
    echo Acesse no smartphone:
    echo http://SEU_IP:8000
    echo.
    echo Para descobrir o IP, abra outro terminal e execute:
    echo ipconfig
    echo.
    echo Pressione Ctrl+C para parar o servidor
    echo ========================================
    echo.
    
    python -m http.server 8000
)

pause
