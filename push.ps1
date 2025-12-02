# push.ps1 - 简化 Git 推送脚本
# 用法:
#   .\push.ps1 "你的提交消息"
#   .\push.ps1  (使用默认消息)
#
# 首次设置:
#   ssh-add "$env:USERPROFILE\.ssh\id_ed25519"
#   git remote set-url origin git@github.com:hhongli1979-coder/AICHI3LM11.29.git

param(
    [string]$message = ""
)

# 如果没有提供消息，使用默认时间戳
if ([string]::IsNullOrEmpty($message)) {
    $message = "Update $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
}

# 检查是否在 git 仓库中
if (-not (Test-Path ".git")) {
    Write-Host "❌ 错误: 当前目录不是 git 仓库" -ForegroundColor Red
    exit 1
}

# 获取当前分支名
$currentBranch = git rev-parse --abbrev-ref HEAD 2>$null
if ([string]::IsNullOrEmpty($currentBranch)) {
    Write-Host "❌ 错误: 无法获取当前分支" -ForegroundColor Red
    exit 1
}

Write-Host "📍 当前分支: $currentBranch" -ForegroundColor Yellow

# 检查是否有更改
$status = git status --porcelain
if ([string]::IsNullOrEmpty($status)) {
    Write-Host "⚠️ 没有需要提交的更改" -ForegroundColor Yellow
    exit 0
}

# Git 操作
Write-Host "📦 添加所有更改..." -ForegroundColor Cyan
git add .

Write-Host "💬 提交: $message" -ForegroundColor Cyan
git commit -m "$message"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 提交失败" -ForegroundColor Red
    exit 1
}

Write-Host "🚀 推送到 origin/$currentBranch ..." -ForegroundColor Cyan
git push origin $currentBranch

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ 推送成功!" -ForegroundColor Green
} else {
    Write-Host "❌ 推送失败" -ForegroundColor Red
    Write-Host "💡 尝试: git push -u origin $currentBranch" -ForegroundColor Yellow
    exit 1
}
