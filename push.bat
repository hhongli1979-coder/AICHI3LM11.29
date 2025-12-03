@echo off
setlocal

set SCRIPT_DIR=%~dp0
powershell -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT_DIR%push.ps1" %*
 ssh-add %USERPROFILE%.ssh\id_ed25519
