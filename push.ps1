# push.ps1 - 简化 Git 推送脚本
# 用法:
#   powershell -File push.ps1 "你的提交消息"
#   powershell -File push.ps1  (使用默认消息)

param(
    [string]$message = "Update $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
)

# 添加 SSH 密钥 (如果尚未添加)
$sshKeyPath = "$env:USERPROFILE\.ssh\id_ed25519"
if (Test-Path $sshKeyPath) {
    ssh-add $sshKeyPath 2>$null
}

# Git 操作
Write-Host "📦 添加所有更改..." -ForegroundColor Cyan
git add .

Write-Host "💬 提交: $message" -ForegroundColor Cyan
git commit -m "$message"

Write-Host "🚀 推送到远程仓库..." -ForegroundColor Cyan
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ 推送成功!" -ForegroundColor Green
} else {
    Write-Host "❌ 推送失败，请检查错误信息" -ForegroundColor Red
}
