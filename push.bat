@echo off
setlocal

set SCRIPT_DIR=%~dp0
powershell -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT_DIR%push.ps1" %*
if exist "%USERPROFILE%\.ssh\id_ed25519" (
    ssh-add "%USERPROFILE%\.ssh\id_ed25519"
) else (
    echo Warning: SSH key not found at %USERPROFILE%\.ssh\id_ed25519
)
