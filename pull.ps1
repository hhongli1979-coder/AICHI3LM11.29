# Git Pull Script - 从远程仓库同步代码到本地
# Usage: .\pull.ps1 [branch]
# 用法：.\pull.ps1 [分支名]

param([string]$branch)

Write-Host "===== Git 代码同步脚本 =====" -ForegroundColor Cyan
Write-Host ""

# 获取当前分支
$currentBranch = & git rev-parse --abbrev-ref HEAD
Write-Host "当前分支: $currentBranch" -ForegroundColor Yellow

# 如果指定了分支，则切换到该分支
if ($branch -and $branch -ne "") {
    Write-Host "正在切换到分支: $branch" -ForegroundColor Yellow
    & git checkout $branch
    if ($LASTEXITCODE -ne 0) {
        Write-Host "错误：切换分支失败" -ForegroundColor Red
        exit 1
    }
    $currentBranch = $branch
}

# 获取远程更新
Write-Host ""
Write-Host "正在获取远程仓库更新..." -ForegroundColor Yellow
& git fetch origin

if ($LASTEXITCODE -ne 0) {
    Write-Host "错误：无法获取远程更新，请检查网络连接" -ForegroundColor Red
    exit 1
}

# 检查本地是否有未提交的更改
$status = & git status --porcelain
if ($status) {
    Write-Host ""
    Write-Host "警告：检测到本地未提交的更改：" -ForegroundColor Magenta
    & git status --short
    Write-Host ""
    $response = Read-Host "是否先暂存这些更改？(y/n)"
    if ($response -eq "y" -or $response -eq "Y") {
        & git stash push -m "Auto stash before pull $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
        Write-Host "更改已暂存" -ForegroundColor Green
    }
}

# 拉取远程代码
Write-Host ""
Write-Host "正在拉取远程代码..." -ForegroundColor Yellow
& git pull origin $currentBranch

if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "错误：拉取失败，可能存在冲突" -ForegroundColor Red
    Write-Host "请手动解决冲突后提交" -ForegroundColor Red
    exit 1
}

# 如果之前暂存了更改，询问是否恢复
$stashList = & git stash list
if ($stashList) {
    Write-Host ""
    $response = Read-Host "是否恢复之前暂存的更改？(y/n)"
    if ($response -eq "y" -or $response -eq "Y") {
        & git stash pop
        if ($LASTEXITCODE -ne 0) {
            Write-Host "警告：恢复暂存更改时可能有冲突，请手动解决" -ForegroundColor Magenta
        } else {
            Write-Host "暂存的更改已恢复" -ForegroundColor Green
        }
    }
}

Write-Host ""
Write-Host "===== 同步完成 =====" -ForegroundColor Green
Write-Host "当前状态：" -ForegroundColor Cyan
& git log --oneline -5
