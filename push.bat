@echo off
setlocal

REM Usage: push.bat [-msg "commit message"] [-branch "branch-name"]
REM If in detached HEAD state, a branch will be created automatically

set SCRIPT_DIR=%~dp0
powershell -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT_DIR%push.ps1" %*
ssh-add %USERPROFILE%\.ssh\id_ed25519
