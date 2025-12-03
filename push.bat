@echo off
setlocal enabledelayedexpansion

:: 简化的 Git 推送脚本 / Simplified Git Push Script
:: 用法 / Usage: push.bat "commit message" [/f] [/l]
:: 选项 / Options: /f 强制推送 / force push, /l 大文件模式 / large file mode

set "SCRIPT_DIR=%~dp0"
set "MSG="
set "OPTIONS="

:: 解析参数 - 第一个非选项参数作为消息 / Parse args - first non-option is message
:parse_args
if "%~1"=="" goto run_script

:: 检查是否是选项（以 / 或 -- 开头）/ Check if option (starts with / or --)
set "ARG=%~1"
if "%ARG:~0,1%"=="/" (
    if /i "%ARG%"=="/f" set "OPTIONS=!OPTIONS! -Force"
    if /i "%ARG%"=="/l" set "OPTIONS=!OPTIONS! -LargeFile"
) else if "%ARG:~0,2%"=="--" (
    if /i "%ARG%"=="--force" set "OPTIONS=!OPTIONS! -Force"
    if /i "%ARG%"=="--large" set "OPTIONS=!OPTIONS! -LargeFile"
) else (
    :: 非选项参数，如果消息为空则设置为消息 / Non-option arg, set as message if empty
    if "!MSG!"=="" set "MSG=%~1"
)
shift
goto parse_args

:run_script
:: 运行 PowerShell 脚本 / Run PowerShell script
powershell -NoProfile -ExecutionPolicy Bypass -File "%SCRIPT_DIR%push.ps1" -msg "%MSG%" %OPTIONS%

:: 显示退出状态 / Show exit status
if %ERRORLEVEL% neq 0 (
    echo.
    echo 推送失败，退出代码: %ERRORLEVEL%
    echo Push failed with exit code: %ERRORLEVEL%
    pause
)

endlocal
