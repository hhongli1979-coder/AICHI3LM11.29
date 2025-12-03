param(
    [string]$msg,
    [switch]$Force,
    [switch]$LargeFile
)

# 设置错误处理 / Error handling
$ErrorActionPreference = "Stop"

# 检查是否在 git 仓库中 / Check if in git repository
if (-not (Test-Path ".git")) {
    Write-Host "错误: 当前目录不是 git 仓库" -ForegroundColor Red
    Write-Host "Error: Not in a git repository" -ForegroundColor Red
    exit 1
}

# 获取当前分支 / Get current branch
$currentBranch = & git branch --show-current 2>$null
if (-not $currentBranch) {
    Write-Host "错误: 无法获取当前分支" -ForegroundColor Red
    Write-Host "Error: Cannot get current branch" -ForegroundColor Red
    exit 1
}
Write-Host "当前分支 / Current branch: $currentBranch" -ForegroundColor Cyan

# 默认提交消息 / Default commit message
if (-not $msg -or $msg -eq "") {
    $msg = "chore: update $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
}

# 大文件处理提示 / Large file handling tips
if ($LargeFile) {
    Write-Host "提示: 大文件模式已启用。如果遇到超时，请考虑:" -ForegroundColor Yellow
    Write-Host "Tip: Large file mode enabled. If timeout occurs, consider:" -ForegroundColor Yellow
    Write-Host "  1. git config http.postBuffer 524288000" -ForegroundColor Yellow
    Write-Host "  2. 使用 Git LFS / Use Git LFS" -ForegroundColor Yellow
    
    # 增加 HTTP 缓冲区 / Increase HTTP buffer
    & git config http.postBuffer 524288000
}

# 暂存更改 / Stage changes
Write-Host "`n正在暂存更改... / Staging changes..." -ForegroundColor Green
& git add -A

# 检查是否有更改 / Check for changes
$pending = & git status --porcelain
if (-not $pending) {
    Write-Host "没有更改需要提交 / No changes to commit" -ForegroundColor Yellow
    
    # 检查是否有未推送的提交 / Check for unpushed commits
    try {
        $unpushed = & git log "origin/$currentBranch..$currentBranch" --oneline 2>$null
        if ($LASTEXITCODE -ne 0) { $unpushed = $null }
    } catch {
        $unpushed = $null
    }
    
    if ($unpushed) {
        Write-Host "检测到未推送的提交，正在推送... / Detected unpushed commits, pushing..." -ForegroundColor Cyan
    } else {
        Write-Host "所有内容都是最新的 / Everything is up to date" -ForegroundColor Green
        exit 0
    }
} else {
    # 提交更改 / Commit changes
    Write-Host "正在提交... / Committing..." -ForegroundColor Green
    & git commit -m "$msg"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "提交失败 / Commit failed" -ForegroundColor Red
        exit 1
    }
}

# 推送更改 / Push changes
Write-Host "`n正在推送到 $currentBranch... / Pushing to $currentBranch..." -ForegroundColor Green
$pushArgs = @("-u", "origin", $currentBranch)
if ($Force) {
    $pushArgs = @("-u", "origin", $currentBranch, "--force")
    Write-Host "警告: 强制推送已启用 / Warning: Force push enabled" -ForegroundColor Yellow
}

try {
    & git push @pushArgs
    if ($LASTEXITCODE -eq 0) {
        Write-Host "`n✓ 推送成功! / Push successful!" -ForegroundColor Green
    } else {
        throw "推送失败 / Push failed"
    }
} catch {
    Write-Host "`n✗ 推送失败。请检查网络连接和权限。" -ForegroundColor Red
    Write-Host "✗ Push failed. Check network and permissions." -ForegroundColor Red
    Write-Host "`n可能的解决方案 / Possible solutions:" -ForegroundColor Yellow
    Write-Host "  1. git pull --rebase origin $currentBranch" -ForegroundColor Yellow
    Write-Host "  2. 检查 SSH 密钥 / Check SSH keys: ssh -T git@github.com" -ForegroundColor Yellow
    Write-Host "  3. 对于大型仓库 / For large repos: git config http.postBuffer 524288000" -ForegroundColor Yellow
    exit 1
}
